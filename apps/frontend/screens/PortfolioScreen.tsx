import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'cryptoDataCache';

const PortfolioScreen = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // assuming you have a way to get userId

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
          const currentValue = currentPrice * position.quantity;
          return {
            ...position,
            currentPrice,
            gainLoss,
            currentValue,
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

   useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAndCacheCryptoData();
      fetchPortfolioData();
    }, [])
  );

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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Portfolio</Text>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>Total Cash: ${portfolioData.totalCash.toFixed(2)}</Text>
            <Text style={[styles.title, styles.rightAligned]}>
              Total Gain/Loss: <Text style={portfolioData.totalGainLoss >= 0 ? styles.positive : styles.negative}>${portfolioData.totalGainLoss.toFixed(2)}</Text>
            </Text>
          </View>
          <Text style={styles.sectionHeader}>Current Positions:</Text>
          {portfolioData.positions.map((position, index) => (
            <View key={index} style={styles.positionContainer}>
              <View style={styles.row}>
                <Text style={styles.bold}>Symbol:</Text>
                <Text>{position.symbol}</Text>
                <Text style={[styles.bold, styles.rightAligned]}>Quantity:</Text>
                <Text>{position.quantity.toFixed(2)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.bold}>Purchase Price:</Text>
                <Text>${position.purchasePrice}</Text>
                <Text style={[styles.bold, styles.rightAligned]}>Current Price:</Text>
                <Text>${position.currentPrice}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.bold, styles.rightAligned]}>Current Value:</Text>
                <Text>${position.currentValue.toFixed(2)}</Text>
                <Text style={styles.bold}>Gain/Loss:</Text>
                <Text style={position.gainLoss >= 0 ? styles.positive : styles.negative}>${position.gainLoss.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  rightAligned: {
    textAlign: 'right',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  positionContainer: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
});

export default PortfolioScreen;
