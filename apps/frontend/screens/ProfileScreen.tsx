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
      <View style={styles.contentContainer}>
        <Text style={styles.infoText}>Account Information:</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="View Transactions"
            onPress={() => navigation.navigate('Transactions')}
            color="#1E90FF"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="View Leaderboard"
            onPress={() => navigation.navigate('Leaderboard')}
            color="#1E90FF"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={logout}
            color="#1E90FF"
          />
        </View>
      </View>
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
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 10,
    width: '100%',
  },
});

export default ProfileScreen;
