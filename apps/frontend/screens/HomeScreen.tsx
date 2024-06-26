import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../AuthContext';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { username } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <Text>Welcome back {username}! your current ranking is ___</Text>
      <Text>Here will be an overview of your account(total cash, total gain/loss, etc).</Text>
      <Text>Recent news and updates could be displayed here along with major indices (S&P500, NASDAQ, DJI, BTC, ETH).</Text>
      <Button 
        title="User Guide"
        onPress={() => navigation.navigate('UserGuide')}
        />
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

export default HomeScreen;
