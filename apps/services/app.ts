const express = require('express');
const serverless = require('serverless-http');
const connectToDatabase = require('./config/database'); // Import your database config
const app = express();
const User = require('./models/User');
require('dotenv').config();



app.use(express.json());

app.get('/', async (req, res) => {
  try {
    await connectToDatabase();  // Ensure DB connection is ready
    res.send('Connected to DB successfully.');
  } catch (err) {
    res.status(500).send('Database connection failed');
  }
}); 




app.post('/users', async (req, res) => {
  console.log("Received request on /users");
  try {
    await connectToDatabase();
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});



module.exports.handler = serverless(app);
