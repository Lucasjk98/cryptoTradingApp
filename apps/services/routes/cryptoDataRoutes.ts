const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/crypto-data', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    res.status(500).send('Server error');
  }
});

export default router;
