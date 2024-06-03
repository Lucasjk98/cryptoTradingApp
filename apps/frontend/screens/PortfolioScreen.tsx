import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PortfolioScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Portfolio</Text>
      <Text>Current Stock Positions:</Text>
      <Text>Total Cash: $0.00</Text>
      <Text>Total Gain/Loss: $0.00</Text>
      <Text>Gain/Loss per Position:</Text>
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
