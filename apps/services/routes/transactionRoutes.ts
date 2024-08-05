import express from 'express';
import { User } from '../models/User';

const router = express.Router();


router.post('/:userId/transactions', async (req, res) => {
  try {
    const { symbol, type, quantity, price } = req.body;
    const user = await User.findById(req.params.userId);
    if (user) {
      const newTransaction = { symbol, type, quantity, price, date: new Date() };
      user.transactions.push(newTransaction as any); 
      await user.save();
      res.status(201).json(newTransaction);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error adding transaction', error });
  }
});

router.get('/:userId/transactions', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).json(user.transactions);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error fetching transactions', error });
  }
});

export default router;
