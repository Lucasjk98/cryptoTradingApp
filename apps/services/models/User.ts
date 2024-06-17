import mongoose, { Schema, Document } from 'mongoose';
import { IPortfolio } from './Portfolio';
import { ITransaction } from './Transaction';

export interface IUser extends Document {
  username: string;
  password: string;
  portfolio: IPortfolio[];
  totalCash: number;
  totalGainLoss: number;
  transactions: ITransaction[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: [
    {
      symbol: { type: String, required: true },
      quantity: { type: Number, required: true },
      purchasePrice: { type: Number, required: true },
    },
  ],
  totalCash: { type: Number, default: 50000 }, 
  totalGainLoss: { type: Number, default: 0 },  
  transactions: [
    {
      symbol: { type: String, required: true },
      type: { type: String, enum: ['buy', 'sell'], required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

export const User = mongoose.model<IUser>('User', UserSchema);
