import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <Text>Leaderboard will be displayed here.</Text>
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

export default LeaderboardScreen;
