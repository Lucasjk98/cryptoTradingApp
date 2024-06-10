import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'cryptoDataCache';

const PortfolioScreen = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // assuming you have a way to get userId

  useEffect(() => {
    const fetchAndCacheCryptoData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        });
        await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching and caching crypto data:', error);
      }
    };

    const fetchPortfolioData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in AsyncStorage');
        
        const response = await axios.get(`http://localhost:3000/api/portfolio/${userId}/portfolio`);
        const portfolioData = response.data;

        // Fetch the cached crypto data
        const cachedData = JSON.parse(await AsyncStorage.getItem(LOCAL_STORAGE_KEY)) || [];

        // Calculate gain/loss for each position
        const positionsWithPrices = portfolioData.positions.map(position => {
          const crypto = cachedData.find(crypto => crypto.symbol.toUpperCase() === position.symbol.toUpperCase());
          const currentPrice = crypto ? crypto.current_price : 0;
          const gainLoss = (currentPrice - position.purchasePrice) * position.quantity;
          return {
            ...position,
            currentPrice,
            gainLoss,
          };
        });

        const totalGainLoss = positionsWithPrices.reduce((acc, position) => acc + position.gainLoss, 0);

        // Update the portfolio data with calculated gain/loss
        setPortfolioData({
          ...portfolioData,
          positions: positionsWithPrices,
          totalGainLoss
        });

      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCacheCryptoData();
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
      <Text>Total Cash: ${portfolioData.totalCash}</Text>
      <Text>Total Gain/Loss: ${portfolioData.totalGainLoss}</Text>
      <Text>Current Stock Positions:</Text>
      {portfolioData.positions.map((position, index) => (
        <View key={index}>
          <Text>Symbol: {position.symbol}</Text>
          <Text>Quantity: {position.quantity}</Text>
          <Text>Purchase Price: ${position.purchasePrice}</Text>
          <Text>Current Price: ${position.currentPrice}</Text>
          <Text>Gain/Loss: ${position.gainLoss}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PortfolioScreen;
