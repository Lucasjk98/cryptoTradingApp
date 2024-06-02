import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Go to Transactions"
        onPress={() => navigation.navigate('Transactions')}
      />
      <Button
        title="Go to Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
