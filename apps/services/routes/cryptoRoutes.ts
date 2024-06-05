import express from 'express';
import { getCryptoPrice, getMarketData, getCryptoDetails } from '../api';

const router = express.Router();

router.get('/price/:id', async (req, res) => {
  try {
    const data = await getCryptoPrice(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/market/:id', async (req, res) => {
  try {
    const data = await getMarketData(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/details/:id', async (req, res) => {
  try {
    const data = await getCryptoDetails(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
