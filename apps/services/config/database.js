const mongoose = require('mongoose');
let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return Promise.resolve();
  }

  console.log('Using new database connection');
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = db.connections[0].readyState;
};

module.exports = connectToDatabase;
