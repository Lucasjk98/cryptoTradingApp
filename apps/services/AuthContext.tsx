// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { loginUser, registerUser } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

 const login = async (username: string, password: string) => {
  try {
    const response = await loginUser(username, password);
    console.log('Login response:', response); 

    if (response && response.token) {
      setIsAuthenticated(true);
      setUserId(response.user.id); 
      await AsyncStorage.setItem('userId', response.user._id);
    } else {
      console.error('Invalid login response', response);
    }
  } catch (error) {
    console.error('Error logging in user:', error);
  }
};


  const register = async (username: string, password: string) => {
    const user = await registerUser(username, password);
    setIsAuthenticated(true);
    setUserId(user.id);
    await AsyncStorage.setItem('userId', user.id); 
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    AsyncStorage.removeItem('userId'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
