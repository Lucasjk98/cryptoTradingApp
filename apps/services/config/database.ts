import mongoose from 'mongoose';
let isConnected = false;

const MONGODB_URI = process.env.MONGODB_URI
if (MONGODB_URI === undefined) {
  throw new Error('MONGODB_URI is undefined')
}

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  console.log('Using new database connection');
  const db = await mongoose.connect(MONGODB_URI);
  isConnected = Boolean(db.connections[0].readyState);
};
