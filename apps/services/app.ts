import 'dotenv/config';

import express from 'express';
import serverless from 'serverless-http'
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Portfolio } from './models/portfolio'
import { Transaction } from './models/Transaction'
import { connectToDatabase } from './config/database'
import dotenv from 'dotenv';
import axios from 'axios';
import userRoutes from './routes/userRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import transactionRoutes from './routes/transactionRoutes';



const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/api/crypto/news', async (req, res) => {
  const { currencies } = req.query;

  try {
    const response = await axios.get('https://cryptopanic.com/api/v1/posts/', {
      params: {
        auth_token: process.env.CRYPTOPANIC_API_KEY,
        currencies:currencies,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    res.status(500).json({ error: 'Failed to fetch crypto news' });
  }
});

app.get('/', async (req, res) => {
    try {
        await connectToDatabase(); 
        res.send('Connected to DB successfully.');
    } catch (err) {
        res.status(500).send('Database connection failed');
    }
});

app.post('/users', async (req, res) => {
    console.log('Received request on /users');
    try {
        await connectToDatabase();
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export const handler = serverless(app);
