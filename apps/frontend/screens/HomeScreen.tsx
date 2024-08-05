import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Linking, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { getLeaderboard, getCryptoNews, getCryptoData } from '../../services/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { username } = useAuth();
  const [userRank, setUserRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [news, setNews] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState({ btc: null, eth: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboard = await getLeaderboard();
        const rank = leaderboard.findIndex(user => user.username === username) + 1;
        setUserRank(rank);
        setTotalUsers(leaderboard.length);
      } catch (error) {
        console.error('Error fetching ranking:', error);
      }

      try {
        const newsData = await getCryptoNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      }

      try {
        const data = await getCryptoData();
        const btc = data.find(crypto => crypto.symbol === 'btc').current_price;
        const eth = data.find(crypto => crypto.symbol === 'eth').current_price;
        setCryptoPrices({ btc, eth });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchData();
  }, [username]);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.article_url)} style={styles.newsCard}>
      <Image source={{ uri: item.image_url }} style={styles.newsImage} />
      <Text style={styles.newsTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Home</Text>
        <Text style={styles.welcomeText}>
          Welcome back <Text style={styles.username}>{username}</Text>!
        </Text>
        <Text style={styles.rankText}>
          Your current ranking is <Text style={styles.rank}>{userRank}</Text> / <Text style={styles.rank}>{totalUsers}</Text>
        </Text>
        <TouchableOpacity style={styles.userGuideButton} onPress={() => navigation.navigate('UserGuide')}>
          <Text style={styles.buttonText}>User Guide</Text>
        </TouchableOpacity>
        <View style={styles.cryptoSection}>
          {cryptoPrices.btc && (
            <View style={styles.cryptoBox}>
              <Text style={styles.cryptoLabel}>Bitcoin (BTC)</Text>
              <Text style={styles.cryptoValue}>${cryptoPrices.btc.toLocaleString()}</Text>
            </View>
          )}
          {cryptoPrices.eth && (
            <View style={styles.cryptoBox}>
              <Text style={styles.cryptoLabel}>Ethereum (ETH)</Text>
              <Text style={styles.cryptoValue}>${cryptoPrices.eth.toLocaleString()}</Text>
            </View>
          )}
        </View>
        <Text style={styles.newsHeader}>Current News:</Text>
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={item => item.id}
          style={styles.newsList}
          contentContainerStyle={styles.newsContainer}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 16,
    borderRadius: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  username: {
    fontWeight: 'bold',
    color: '#333',
  },
  rankText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  rank: {
    fontWeight: 'bold',
    color: '#2e86de',
  },
  userGuideButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cryptoSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  cryptoBox: {
    alignItems: 'center',
    flex: 1,
  },
  cryptoLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cryptoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e86de',
  },
  newsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  newsList: {
    width: '100%',
  },
  newsContainer: {
    paddingBottom: 20,
  },
  newsCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  newsTitle: {
    fontSize: 16,
    flexShrink: 1,
    color: '#333',
  },
});

export default HomeScreen;
