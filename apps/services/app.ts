import 'dotenv/config';

import express from 'express';
import serverless from 'serverless-http'
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Portfolio } from './models/Portfolio'
import { Transaction } from './models/Transaction'
import { connectToDatabase } from './config/database'
import dotenv from 'dotenv';
import axios from 'axios';
import userRoutes from './routes/userRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import transactionRoutes from './routes/transactionRoutes';
import cryptoDataRoutes from './routes/cryptoDataRoutes';



const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/crypto', cryptoDataRoutes);



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

const initServer = async () => {
  try {
    await connectToDatabase();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

initServer();

export const handler = serverless(app);
