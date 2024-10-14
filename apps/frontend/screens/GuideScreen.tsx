import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const GuideScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>User Guide</Text>

      {/* Overview Section */}
      <Text style={styles.subheader}>Overview</Text>
      <Text style={styles.bodyText}>
        Welcome to the Paper Trading App, your go-to platform for practicing cryptocurrency trading without real-world financial risk! 
        With this app, you can simulate buying and selling cryptocurrencies, monitor your portfolio, and track market trends, 
        all while competing with others on the leaderboard. Let’s walk through how you can use the app.
      </Text>

      {/* Navigation Section */}
      <Text style={styles.subheader}>Navigating the App</Text>
      <Text style={styles.bodyText}>
        The app is divided into four main sections, which you can access via the navigation bar at the bottom:
      </Text>

      <Text style={styles.pageName}>Home</Text>
      <Text style={styles.bodyText}>Displays the latest crypto prices, news, and your ranking.</Text>

      <Text style={styles.pageName}>Crypto</Text>
      <Text style={styles.bodyText}>Search for cryptocurrencies, view their charts, and place buy or sell orders.</Text>

      <Text style={styles.pageName}>Portfolio</Text>
      <Text style={styles.bodyText}>View your current holdings, cash balance, and track your performance.</Text>

      <Text style={styles.pageName}>Profile</Text>
      <Text style={styles.bodyText}>Access your past transactions, view the leaderboard, or log out.</Text>

      {/* How to Place a Trade */}
      <Text style={styles.subheader}>Placing a Trade</Text>
      <Text style={styles.bodyText}>
        To buy or sell cryptocurrencies, head to the Crypto tab. You can search for the crypto you're interested in using the search bar, 
        view the price and market data, and enter how much you'd like to buy or sell. Confirm your transaction to see the changes reflected in your portfolio.
      </Text>

      {/* Viewing Portfolio */}
      <Text style={styles.subheader}>Viewing Your Portfolio</Text>
      <Text style={styles.bodyText}>
        The Portfolio tab shows your current holdings and cash balance. You can track your overall gain/loss and see details 
        like purchase price, current price, and performance for each asset you own.
      </Text>

      {/* Staying Informed with News */}
      <Text style={styles.subheader}>Keeping Up with Crypto News</Text>
      <Text style={styles.bodyText}>
        The Home tab keeps you updated with the latest crypto news. Stay informed to help guide your trades by reading headlines 
        that cover the latest trends and market movements.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
    color: '#333',
  },
  pageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
    marginBottom: 5,
  },
});

export default GuideScreen;
