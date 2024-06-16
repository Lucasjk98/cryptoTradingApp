// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

useEffect(() => {
    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 > Date.now()) {
                setIsAuthenticated(true);
                setUserId(decoded.userId);
                setUsername(decoded.username);
            } else {
                await AsyncStorage.removeItem('token');
            }
        }
    };
    checkToken();
}, []);


 const login = async (username: string, password: string) => {
  try {
    const response = await loginUser(username, password);
    console.log('Login response:', response); 

    if (response && response.token) {
      setIsAuthenticated(true);
      setUserId(response.user.id); 
      setUsername(response.user.username);
      await AsyncStorage.setItem('userId', response.user._id);
      await AsyncStorage.setItem('username', response.user.username);
      await AsyncStorage.setItem('token', response.token);
    } else {
      console.error('Invalid login response', response);
    }
  } catch (error) {
    console.error('Error logging in user:', error);
  }
};


  const register = async (username: string, password: string) => {
    try{
      const user = await registerUser(username, password);
    } catch (error) {
      console.error('Error registering user:', error);
    }  
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    AsyncStorage.removeItem('userId'); 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username, login, register, logout }}>
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
