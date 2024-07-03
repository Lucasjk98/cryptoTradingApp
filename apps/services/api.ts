import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});


export const getCryptoNews = async () => {
    try {
        const response = await backendApi.get('/crypto/crypto-news'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching crypto news:', error);
        throw error;
    }
};

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await backendApi.post('/users/register', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await backendApi.post('/users/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await backendApi.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    const response = await backendApi.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const addToPortfolio = async (userId: string, symbol: string, quantity: number, purchasePrice: number, type: 'buy' | 'sell') => {
  try {
    const response = await backendApi.post(`/portfolio/${userId}/portfolio`, {
      symbol,
      quantity,
      purchasePrice,
      type,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    throw error;
  }
};

export const getPortfolio = async (userId: string) => {
  try {
    const response = await backendApi.get(`/portfolio/${userId}/portfolio`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

export const getTransactions = async (userId: string) => {
  try {
    const response = await backendApi.get(`/transactions/${userId}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getCryptoData = async () => {
  try {
    const response = await backendApi.get(`/crypto/crypto-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};

export const getHistoricalDataDaily = async (id: string) => {
  try {
    const response = await backendApi.get(`/crypto/crypto-historical-data/daily/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching daily historical data:', error);
    throw error;
  }
};

export const getHistoricalDataYearly = async (id: string) => {
  try {
    const response = await backendApi.get(`/crypto/crypto-historical-data/yearly/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching yearly historical data:', error);
    throw error;
  }
};

export const getLeaderboard = async (username: string) => {
  try {
    const response = await backendApi.get('/users/leaderboard');
    const leaderboard = response.data;
    const userRank = leaderboard.findIndex((user: any) => user.username === username) + 1;
    return { leaderboard, userRank };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

