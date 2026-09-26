const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const getDBStatus = () => isConnected;

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.getDBStatus = getDBStatus;
