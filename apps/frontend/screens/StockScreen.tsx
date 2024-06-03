import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const StockScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Stock</Text>
      <TextInput style={styles.input} placeholder="Search for a stock..." />
      <Text>Stock Chart will be displayed here.</Text>
      <Button title="Buy" onPress={() => {}} />
      <Button title="Sell" onPress={() => {}} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    width: '80%',
  },
});

export default StockScreen;
