import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, TextInput, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { getCryptoData, addToPortfolio, getHistoricalDataDaily, getHistoricalDataYearly } from '../../services/api';

const LOCAL_STORAGE_KEY = 'cryptoDataCache';
const HISTORICAL_DATA_KEY = 'historicalDataCache';
const DAILY_DATA_KEY = 'dailyDataCache';
const screenWidth = Dimensions.get("window").width;

const CryptoScreen = () => {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [query, setQuery] = useState<string>('');
  const [dollarAmount, setDollarAmount] = useState('');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [duration, setDuration] = useState<string>('1D'); 
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 });


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
      } else {
        console.error('Data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching and caching crypto data:', error);
    }
  };

  const fetchHistoricalData = async (cryptoId: string) => {
    try {
      const yearlyData = await getHistoricalDataYearly(cryptoId);
      const historicalDataCache = await AsyncStorage.getItem(HISTORICAL_DATA_KEY);
      const parsedHistoricalDataCache = JSON.parse(historicalDataCache || '{}');
      parsedHistoricalDataCache[cryptoId] = yearlyData;
      await AsyncStorage.setItem(HISTORICAL_DATA_KEY, JSON.stringify(parsedHistoricalDataCache));
      
      const dailyData = await getHistoricalDataDaily(cryptoId);
      const dailyDataCache = await AsyncStorage.getItem(DAILY_DATA_KEY);
      const parsedDailyDataCache = JSON.parse(dailyDataCache || '{}');
      parsedDailyDataCache[cryptoId] = dailyData;
      await AsyncStorage.setItem(DAILY_DATA_KEY, JSON.stringify(parsedDailyDataCache));

      if (duration === '1D') {
        processData(dailyData);
      } else {
        processData(yearlyData);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
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

      const searchQueryLower = searchQuery.toLowerCase();
      const cryptoInfo = cachedData.find(
        (crypto: any) =>
          crypto.id.toLowerCase() === searchQueryLower ||
          crypto.symbol.toLowerCase() === searchQueryLower
      );

      if (cryptoInfo) {
        setCryptoData(cryptoInfo);
        const historicalDataCache = await AsyncStorage.getItem(HISTORICAL_DATA_KEY);
        const parsedHistoricalDataCache = JSON.parse(historicalDataCache || '{}');
        const dailyDataCache = await AsyncStorage.getItem(DAILY_DATA_KEY);
        const parsedDailyDataCache = JSON.parse(dailyDataCache || '{}');

        if (duration === '1D' && parsedDailyDataCache[cryptoInfo.id]) {
          processData(parsedDailyDataCache[cryptoInfo.id]);
        } else if (parsedHistoricalDataCache[cryptoInfo.id]) {
          processData(parsedHistoricalDataCache[cryptoInfo.id]);
        } else {
          fetchHistoricalData(cryptoInfo.id);
        }
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

  const processData = (data) => {
    let prices = data.prices;
    let formattedData = [];
    let formattedLabels = [];

    const now = Date.now(); 

    if (duration === '1D') {
      const last24HoursData = prices.filter(item => item[0] > (now - 24 * 60 * 60 * 1000));
      const interval = Math.max(Math.floor(last24HoursData.length / 12), 1); 

      formattedData = last24HoursData.filter((_, index) => index % interval === 0).map(item => item[1]);
      formattedLabels = last24HoursData.filter((_, index) => index % interval === 0).map(item => new Date(item[0]).toLocaleTimeString([], { hour: '2-digit' }));
    } else if (duration === '1W') {
      const lastWeekData = prices.filter(item => item[0] > (now - 7 * 24 * 60 * 60 * 1000));
      const interval = Math.floor(lastWeekData.length / 7);
      formattedData = lastWeekData.filter((_, index) => index % interval === 0).map(item => item[1]);
      formattedLabels = lastWeekData.filter((_, index) => index % interval === 0).map(item => new Date(item[0]).toLocaleDateString('en-US', { weekday: 'short' }));
    } else if (duration === '1M') {
      const lastMonthData = prices.filter(item => item[0] > (now - 30 * 24 * 60 * 60 * 1000));
      const interval = Math.floor(lastMonthData.length / 4);
      formattedData = lastMonthData.filter((_, index) => index % interval === 0).map(item => item[1]);
      formattedLabels = lastMonthData.filter((_, index) => index % interval === 0).map(item => new Date(item[0]).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
    } else if (duration === '1Y') {
      const interval = Math.floor(prices.length / 12);
      formattedData = prices.filter((_, index) => index % interval === 0).map(item => item[1]);
      formattedLabels = prices.filter((_, index) => index % interval === 0).map(item => new Date(item[0]).toLocaleDateString('en-US', { month: 'short' }));
    }

    setData(formattedData);
    setLabels(formattedLabels);
  };

  useEffect(() => {
    if (cryptoData) {
      const historicalDataCache = AsyncStorage.getItem(HISTORICAL_DATA_KEY).then((data) => {
        const parsedHistoricalDataCache = JSON.parse(data || '{}');
        if (duration === '1D') {
          const dailyDataCache = AsyncStorage.getItem(DAILY_DATA_KEY).then((dailyData) => {
            const parsedDailyDataCache = JSON.parse(dailyData || '{}');
            if (parsedDailyDataCache[cryptoData.id]) {
              processData(parsedDailyDataCache[cryptoData.id]);
            }
          });
        } else if (parsedHistoricalDataCache[cryptoData.id]) {
          processData(parsedHistoricalDataCache[cryptoData.id]);
        }
      });
    }
  }, [duration]);

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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{cryptoData.name}</Text>
            <Image
              source={{ uri: cryptoData.image }}
              style={styles.cryptoImage}
            />
          </View>
            <Text><Text style={styles.bold}>Current Price:</Text> ${cryptoData.current_price}</Text>
            <Text><Text style={styles.bold}>Market Cap:</Text> ${cryptoData.market_cap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
            <Text><Text style={styles.bold}>Daily High:</Text> ${cryptoData.high_24h}</Text>
            <Text><Text style={styles.bold}>Daily Low:</Text> ${cryptoData.low_24h}</Text>

            <View style={styles.durationContainer}>
              <TouchableOpacity onPress={() => setDuration('1D')}>
                <Text style={duration === '1D' ? styles.activeDuration : styles.duration}>1D</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDuration('1W')}>
                <Text style={duration === '1W' ? styles.activeDuration : styles.duration}>1W</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDuration('1M')}>
                <Text style={duration === '1M' ? styles.activeDuration : styles.duration}>1M</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDuration('1Y')}>
                <Text style={duration === '1Y' ? styles.activeDuration : styles.duration}>1Y</Text>
              </TouchableOpacity>
            </View>

            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: data,
                  },
                ],
              }}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={{
              backgroundColor: '#1f1f1f',
              backgroundGradientFrom: '#1f1f1f',
              backgroundGradientTo: '#3e3e3e',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffffff',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: 'center',
            }}
            />
            
            <View style={{ marginBottom: 20 }} />
            <Text style={styles.sectionHeader}>Place an Order for {cryptoData.name}:</Text>
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
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cryptoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft:10,
  },
  title: {
    fontSize: 40,
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
  durationContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  duration: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'gray',
  },
  activeDuration: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
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
