import axios from 'axios';

const backendApi = axios.create({
  baseURL: 'http://localhost:3000/api',
});

const newsApi = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const getCryptoNews = async (query: string) => {
  try {
    const response = await newsApi.get('/api/crypto/news', {
      params: {
        currencies: query,
      },
    });
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

export const getUserData = async (id: string) => {
  try {
    const response = await backendApi.get(`/users/${id}`);
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
