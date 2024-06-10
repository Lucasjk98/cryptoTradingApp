import express from 'express';
import { User } from '../models/User';
import { Portfolio } from '../models/portfolio';
import { Transaction } from '../models/Transaction';
import mongoose from 'mongoose';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const router = express.Router();

// Get user portfolio
router.get('/:userId/portfolio', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the user's portfolio symbols
    const portfolioSymbols = user.portfolio.map((item) => item.symbol).join(',');

    // Fetch the latest crypto prices from CoinGecko
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: portfolioSymbols,
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });

    const cryptoData = response.data;

    // Calculate gain/loss for each position
    const positionsWithPrices = user.portfolio.map((position) => {
      const crypto = cryptoData.find((crypto) => crypto.id.toUpperCase() === position.symbol.toUpperCase());
      const currentPrice = crypto ? crypto.current_price : 0;
      const gainLoss = (currentPrice - position.purchasePrice) * position.quantity;

      return {
        ...position._doc,
        currentPrice,
        gainLoss,
      };
    });

    user.totalGainLoss = positionsWithPrices.reduce((acc, position) => acc + position.gainLoss, 0);
    await user.save();

    res.status(200).json({
      totalCash: user.totalCash,
      totalGainLoss: user.totalGainLoss,
      positions: positionsWithPrices,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(400).json({ message: 'Error fetching portfolio', error: error.message || error });
  }
});

// Update a portfolio item for a user
router.put('/:userId/portfolio/:portfolioItemId', async (req, res) => {
    try {
        const { userId, portfolioItemId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(portfolioItemId)) {
            return res.status(400).json({ message: 'Invalid userId or portfolioItemId' });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const portfolioObjectId = new mongoose.Types.ObjectId(portfolioItemId);

        // Find the portfolio item by ID
        const portfolioItem = await Portfolio.findOne({ _id: portfolioObjectId, userId: userObjectId });

        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        // Update the quantity
        portfolioItem.quantity += quantity;

        // If quantity drops to zero or below, delete the portfolio item
        if (portfolioItem.quantity <= 0) {
            await Portfolio.deleteOne({ _id: portfolioObjectId });
            return res.status(200).json({ message: 'Portfolio item deleted' });
        }

        // Save the updated portfolio item
        await portfolioItem.save();

        res.status(200).json({
            message: 'Portfolio item updated successfully',
            portfolioItem,
        });
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(400).json({
            message: 'Error updating portfolio item',
            error: error.message || error,
        });
    }
});

// Add a new portfolio item for a user
router.post('/:userId/portfolio', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { symbol, quantity, purchasePrice, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the portfolio item in the user's portfolio
    const portfolioItem = user.portfolio.find(item => item.symbol === symbol);

    if (portfolioItem) {
      // Update the quantity if the portfolio item exists
      portfolioItem.quantity += quantity;

      if (portfolioItem.quantity <= 0) {
        // Remove the portfolio item if quantity is less than or equal to 0
        user.portfolio = user.portfolio.filter(item => item.symbol !== symbol);
        res.status(200).json({ message: 'Portfolio item removed successfully' });
      } else {
        res.status(200).json({ message: 'Portfolio item updated successfully', portfolioItem });
      }
    } else {
      // Add a new portfolio item if it doesn't exist
      user.portfolio.push({
        userId: user._id,
        symbol,
        quantity,
        purchasePrice,
      });
      res.status(201).json({ message: 'Portfolio item added successfully', newPortfolioItem: { symbol, quantity, purchasePrice } });
    }

    // Log the transaction
    const newTransaction = new Transaction({
      symbol,
      type,
      quantity,
      price: purchasePrice,
      date: new Date(),
    });
    user.transactions.push(newTransaction);

    // Save the user document
    await user.save();

  } catch (error) {
    console.error('Error adding/updating portfolio item:', error);
    res.status(400).json({
      message: 'Error adding/updating portfolio item',
      error: error.message || error,
    });
  }
});

export default router;
