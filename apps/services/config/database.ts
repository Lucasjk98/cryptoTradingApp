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

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('Using new database connection');
  } catch (error) {
    console.error('Database connection failed', error);
    throw new Error('Database connection failed');
  }
};
