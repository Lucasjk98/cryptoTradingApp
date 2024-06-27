import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCryptoData, addToPortfolio } from '../../services/api';

const LOCAL_STORAGE_KEY = 'cryptoDataCache';

const CryptoScreen = () => {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [query, setQuery] = useState<string>('');
  const [dollarAmount, setDollarAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');

  useEffect(() => {
    fetchAndCacheCryptoData();

    const intervalId = setInterval(() => {
      fetchAndCacheCryptoData();
    }, 90000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchAndCacheCryptoData = async () => {
  try {
    const data = await getCryptoData();
    if (Array.isArray(data)) {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } 
  } catch (error) {
    console.error('Error fetching and caching crypto data:', error);
  }
};

  const fetchCryptoDataFromCache = async (searchQuery: string) => {
    try {
      const storedData = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
      const cachedData = JSON.parse(storedData || '[]');

      if (!Array.isArray(cachedData)) {
        console.error('Cached data is not an array:', cachedData);
        setCryptoData(null);
        return;
      }

      const normalizedQuery = searchQuery.toLowerCase();
      const cryptoInfo = cachedData.find((crypto: any) => 
        crypto.id.toLowerCase() === normalizedQuery || crypto.symbol.toLowerCase() === normalizedQuery
      );
      if (cryptoInfo) {
        setCryptoData(cryptoInfo);
      } else {
        console.error('Crypto not found in cache:', searchQuery);
        setCryptoData(null);
      }
    } catch (error) {
      console.error('Error fetching crypto data from cache:', error);
      setCryptoData(null);
    }
  };

  const handleSearch = () => {
    fetchCryptoDataFromCache(query);
  };

  const handleTransaction = async (type) => {
    const userId = await AsyncStorage.getItem('userId');
    const symbol = cryptoData.symbol;
    const purchasePrice = cryptoData.current_price;
    let quantity = parseFloat(cryptoAmount);

    if (!quantity && dollarAmount) {
      quantity = parseFloat(dollarAmount) / purchasePrice;
    }

    if (type === 'sell') {
      quantity = -quantity;
    }

    try {
      const response = await addToPortfolio(userId, symbol, quantity, purchasePrice, type);
      if (response.status === 200 || response.status === 201) {
        alert('Transaction successful');
      } else {
        alert('Transaction failed');
      }
    } catch (error) {
      console.error('Error making transaction:', error);
      alert('Transaction failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter name or ticker"
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
        <Button title="Search" onPress={handleSearch} />
        {cryptoData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.title}>{cryptoData.name}</Text>
            <Text><Text style={styles.bold}>Current Price:</Text> ${cryptoData.current_price}</Text>
            <Text><Text style={styles.bold}>Market Cap:</Text> ${cryptoData.market_cap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
            <Text><Text style={styles.bold}>Daily High:</Text> ${cryptoData.high_24h}</Text>
            <Text><Text style={styles.bold}>Daily Low:</Text> ${cryptoData.low_24h}</Text>
            <View>
              <Text style={styles.subtitle}>Place an Order for {cryptoData.name}:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount in dollars"
                value={dollarAmount}
                onChangeText={(text) => setDollarAmount(text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter amount in crypto"
                value={cryptoAmount}
                onChangeText={(text) => setCryptoAmount(text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Buy" onPress={() => handleTransaction('buy')} color="green" />
              <Button title="Sell" onPress={() => handleTransaction('sell')} color="red" />
            </View>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Enter a cryptocurrency name or ticker to see price data and place an order.</Text>
          </View>
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
    padding: 20,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  input: {
    marginBottom: 5,
    marginTop: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dataContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default CryptoScreen;