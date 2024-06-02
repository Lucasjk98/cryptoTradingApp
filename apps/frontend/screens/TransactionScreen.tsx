// src/screens/TransactionScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Transaction Screen</Text>
      {/* Add your transaction list or details here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionScreen;
