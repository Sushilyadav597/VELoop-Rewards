const path = require('path');
const mongoose = require('mongoose');

// Ensure environment variables are loaded if connectDB is called directly
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  require('dotenv').config();
}

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
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

const getDBStatus = () => isConnected;

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.getDBStatus = getDBStatus;
