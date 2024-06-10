import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionsScreen = () => {
  const { userId } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in AsyncStorage');

        const response = await axios.get(`http://localhost:3000/api/transactions/${userId}/transactions`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Transactions</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <View key={transaction._id} style={styles.transactionContainer}>
              <Text style={styles.transactionText}>Symbol: {transaction.symbol}</Text>
              <Text style={styles.transactionText}>Type: {transaction.type}</Text>
              <Text style={styles.transactionText}>Quantity: {transaction.quantity}</Text>
              <Text style={styles.transactionText}>Price: ${transaction.price.toFixed(2)}</Text>
              <Text style={styles.transactionText}>Date: {new Date(transaction.date).toLocaleString()}</Text>
            </View>
          ))
        ) : (
          <Text>No transactions found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  transactionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default TransactionsScreen;

