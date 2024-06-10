import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { AuthProvider, useAuth } from '../services/AuthContext';

const MainNavigator = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
}
