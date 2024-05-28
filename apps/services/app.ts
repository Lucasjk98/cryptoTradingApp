import 'dotenv/config';

import express from 'express';
import serverless from 'serverless-http'
import { connectToDatabase } from './config/database'
import { User } from './models/User'

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        await connectToDatabase(); // Ensure DB connection is ready
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
