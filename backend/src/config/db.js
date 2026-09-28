const path = require('path');
const mongoose = require('mongoose');

// Ensure environment variables are loaded if connectDB is called directly
if (!process.env.MONGO_URI) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  require('dotenv').config();
}

let isConnected = false;

const cleanMongoURI = (rawURI) => {
  if (!rawURI) return '';
  let uri = rawURI.trim().replace(/^["']|["']$/g, '');
  const qIndex = uri.indexOf('?');
  if (qIndex !== -1) {
    const base = uri.substring(0, qIndex);
    const queryPart = uri.substring(qIndex + 1).replace(/\?/g, '&');
    const params = new URLSearchParams(queryPart);
    const uniqueParams = new URLSearchParams();
    for (const [key, value] of params.entries()) {
      if (!uniqueParams.has(key)) {
        uniqueParams.set(key, value);
      }
    }
    const queryString = uniqueParams.toString();
    return queryString ? `${base}?${queryString}` : base;
  }
  return uri;
};

const connectDB = async () => {
  try {
    const rawMongoURI = process.env.MONGO_URI;

    if (!rawMongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const mongoURI = cleanMongoURI(rawMongoURI);

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
