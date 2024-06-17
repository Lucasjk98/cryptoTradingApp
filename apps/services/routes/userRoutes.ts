import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Portfolio } from '../models/Portfolio';
import { Transaction } from '../models/Transaction';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const router = express.Router();

// Register a new user
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

// Login a user
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

// Get user data
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
