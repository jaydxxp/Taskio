const mongoose = require('mongoose');
const User = require('./user');
const Task = require('./task');
const dotenv = require("dotenv")
dotenv.config();

const MONGO_URI = process.env.MONGO_URI ;


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('connection failed', err.message);
    process.exit(1);
  }
};


const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err.message);
  }
};


module.exports = {
  mongoose,
  connectDB,
  disconnectDB,
  User,
  Task,
};
