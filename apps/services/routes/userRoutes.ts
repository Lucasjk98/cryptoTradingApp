import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Portfolio } from '../models/Portfolio';
import { Transaction } from '../models/Transaction';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

const router = express.Router();

const fetchCurrentPrices = async (symbols) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: symbols.join(','),
        vs_currencies: 'usd',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current prices:', error);
    throw error;
  }
};

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find().lean();
    const symbols = Array.from(new Set(users.flatMap(user => user.portfolio.map(position => position.symbol.toLowerCase()))));
    const prices = await fetchCurrentPrices(symbols);

    const usersWithGainLoss = users.map(user => {
      const totalGainLoss = user.portfolio.reduce((acc, position) => {
        const currentPrice = prices[position.symbol.toLowerCase()]?.usd || 0;
        const gainLoss = (currentPrice - position.purchasePrice) * position.quantity;
        return acc + gainLoss;
      }, 0);

      return {
        username: user.username,
        totalGainLoss,
      };
    }).filter(user => user.totalGainLoss !== 0);

    usersWithGainLoss.sort((a, b) => b.totalGainLoss - a.totalGainLoss);

    res.status(200).json(usersWithGainLoss);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser});
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Received login request:', username, password); 
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            console.log('JWT secret:', process.env.JWT_SECRET);
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '10m' });
            res.status(200).json({ message: 'Login successful', token, user });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Transaction.deleteMany({ userId: user._id });
    await Portfolio.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(400).json({ message: 'Error deleting user account' });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
});





export default router;
