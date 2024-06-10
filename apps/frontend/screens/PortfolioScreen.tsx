import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PortfolioScreen = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in AsyncStorage');
        }
        else {
        const response = await axios.get(`http://localhost:3000/api/portfolio/${userId}/portfolio`);
        setPortfolioData(response.data);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!portfolioData) {
    return (
      <View style={styles.container}>
        <Text>No portfolio data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Portfolio</Text>
      <Text>Current Stock Positions:</Text>
      <Text>Total Cash: ${portfolioData.totalCash}</Text>
      <Text>Total Gain/Loss: ${portfolioData.totalGainLoss}</Text>
      {portfolioData.positions.map((position, index) => (
        <View key={index}>
          <Text>Symbol: {position.symbol}</Text>
          <Text>Quantity: {position.quantity}</Text>
          <Text>Gain/Loss: ${position.gainLoss}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default PortfolioScreen;
