import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../services/AuthContext';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text>Account Information:</Text>
      <Button
        title="View Transactions"
        onPress={() => navigation.navigate('Transactions')}
      />
      <Button
        title="View Leaderboard"
        onPress={() => navigation.navigate('Leaderboard')}
      />
      <Button title="Logout" onPress={logout} />
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

export default ProfileScreen;
