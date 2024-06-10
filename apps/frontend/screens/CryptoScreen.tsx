import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, Linking, TouchableOpacity, Dimensions, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { getCryptoNews } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_STORAGE_KEY = 'cryptoDataCache';

const CryptoScreen = () => {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [cryptoNews, setCryptoNews] = useState<any>(null);
  const [query, setQuery] = useState<string>('bitcoin');

  useEffect(() => {
    fetchAndCacheCryptoData();
    
    const intervalId = setInterval(() => {
    fetchAndCacheCryptoData();
  }, 90000); 

  return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

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
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching and caching crypto data:', error);
    }
  };

  const fetchCryptoDataFromCache = async (searchQuery: string) => {
    const cachedData = JSON.parse((await AsyncStorage.getItem(LOCAL_STORAGE_KEY)) || '[]');
    const cryptoInfo = cachedData.find((crypto: any) => crypto.id === searchQuery);
    if (cryptoInfo) {
      setCryptoData(cryptoInfo);
    } else {
      console.error('Crypto not found in cache');
    }
  };

  const fetchCryptoNews = async (searchQuery: string) => {
    try {
      const newsData = await getCryptoNews(searchQuery);
      console.log(newsData.data);
      setCryptoNews(newsData.results);
      console.log(cryptoNews);
    } catch (error) {
      console.error('Error fetching crypto news:', error);
    }
  };

  const handleSearch = () => {
    fetchCryptoDataFromCache(query);
    fetchCryptoNews(query);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter cryptocurrency (e.g., bitcoin)"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />
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
          {cryptoNews && (
            <View style={styles.newsContainer}>
              <Text style={styles.newsTitle}>News related to {cryptoData.name}:</Text>
              {cryptoNews.map((news: any, index: number) => (
                <View key={news.id} style={styles.newsItem}>
                  <Image source={{ uri: news.thumb_2x }} style={styles.newsImage} />
                  <View style={styles.newsTextContainer}>
                    <Text style={styles.newsTitle} onPress={() => Linking.openURL(news.url)}>{news.title}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(news.url)}>
                      <Text style={styles.newsLink}>Read more</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  </ScrollView>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dataContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: screenWidth < 400 ? 18 : 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  newsContainer: {
    marginTop: 20,
  },
  newsTitle: {
    fontSize: screenWidth < 400 ? 16 : 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  newsImage: {
    width: screenWidth < 400 ? 40 : 50,
    height: screenWidth < 400 ? 40 : 50,
    borderRadius: 4,
    marginRight: 16,
  },
  newsTextContainer: {
    flex: 1,
  },
  newsLink: {
    fontWeight: 'bold',
    color: 'blue',
    marginTop: 5,
  },
});

export default CryptoScreen;
