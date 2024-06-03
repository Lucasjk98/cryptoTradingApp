import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const CryptoScreen = () => {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [query, setQuery] = useState<string>('bitcoin');

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: query
        }
      });
      setCryptoData(response.data[0]);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter cryptocurrency (e.g., bitcoin)"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={fetchCryptoData} />
      {cryptoData && (
        <View style={styles.dataContainer}>
          <Text style={styles.title}>{cryptoData.name}</Text>
          <Text>Current Price: ${cryptoData.current_price}</Text>
          <Text>Market Cap: ${cryptoData.market_cap}</Text>
          <Text>24h High: ${cryptoData.high_24h}</Text>
          <Text>24h Low: ${cryptoData.low_24h}</Text>
        <View style={styles.buttonContainer}>
        <Button title="Buy" onPress={() => {}} color="green" />
        <Button title="Sell" onPress={() => {}} color="red" />
        </View>
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  dataContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default CryptoScreen;
