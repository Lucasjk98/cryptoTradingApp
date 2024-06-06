import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: Date;
}

const TransactionSchema: Schema = new Schema({
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
