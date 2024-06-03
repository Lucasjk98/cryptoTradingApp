import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GuideScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Guide</Text>
      <Text>Welcome to the Paper Trading App!</Text>
      <Text>This guide will help you navigate and use the app:</Text>
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

export default GuideScreen;
