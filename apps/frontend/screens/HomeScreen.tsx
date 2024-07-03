import React, { useEffect, useState } from 'react' 
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../AuthContext';
import { getLeaderboard, getCryptoNews, getCryptoData } from '../../services/api';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { username } = useAuth();
    const [userRank, setUserRank] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null);
    const [news, setNews] = useState([]);
    const [cryptoPrices, setCryptoPrices] = useState({btc: null, eth: null});

    useEffect(() => {
        const fetchData = async () => {
            try {
              const { leaderboard, userRank } = await getLeaderboard(username);
              setUserRank(userRank);
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
        <TouchableOpacity onPress={() => Linking.openURL(item.article_url)}>
            <View style={styles.newsItem}>
                <Image source={{ uri: item.image_url }} style={styles.newsImage} />
                <Text style={styles.newsTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <Text>Welcome back {username}! your current ranking is {userRank} / {totalUsers}</Text>
      <Button 
        title="User Guide"
        onPress={() => navigation.navigate('UserGuide')}
        />
      {cryptoPrices.btc && (
        <Text style={styles.cryptoPrice}>Bitcoin (BTC): ${cryptoPrices.btc}</Text>
      )}
      {cryptoPrices.eth && (
        <Text style={styles.cryptoPrice}>Ethereum (ETH): ${cryptoPrices.eth}</Text>
      )}
      <Text style={styles.header}>Crypto News:</Text>
      <FlatList
                data={news}
                renderItem={renderNewsItem}
                keyExtractor={item => item.id}
                style={styles.newsList}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    newsList: {
        marginTop: 16,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',
    },
    newsImage: {
        width: 100,
        height: 100,
        marginRight: 16,
    },
    newsTitle: {
        fontSize: 16,
        flexShrink: 1,
    },
    cryptoPrice: {
        fontSize: 18,
        marginTop: 10,
    }
});

export default HomeScreen;