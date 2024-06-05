import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

const newsApi = axios.create({
  baseURL: 'http://localhost:3002/api/crypto',
});

export const getCryptoNews = async (query: string) => {
  try {
    const response = await api.get('/news', {
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
// Function to get current price of a cryptocurrency
export const getCryptoPrice = async (id: string): Promise<any> => {
  try {
    const response = await api.get('/simple/price', {
      params: {
        ids: id,
        vs_currencies: 'usd',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

// Function to get historical market data for a cryptocurrency
export const getMarketData = async (id: string, days: number = 30): Promise<any> => {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Function to get detailed information for a cryptocurrency
export const getCryptoDetails = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/coins/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    throw error;
  }
};
