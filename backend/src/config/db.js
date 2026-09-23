const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;
  const localURI = 'mongodb://127.0.0.1:27017/veloop_rewards';

  // 1. Try configured URI first if provided
  if (primaryURI && !primaryURI.includes('127.0.0.1')) {
    try {
      const conn = await mongoose.connect(primaryURI, {
        serverSelectionTimeoutMS: 2500,
      });
      isConnected = true;
      console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
      return true;
    } catch (error) {
      console.warn(`[MongoDB Notice]: Could not connect with Atlas MONGO_URI (${error.message}). Attempting local MongoDB...`);
    }
  }

  // 2. Try local MongoDB instance
  try {
    const conn = await mongoose.connect(localURI, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected (Local)]: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (localError) {
    isConnected = false;
    console.warn(`\n[MongoDB Connection Notice]:`);
    console.warn(`Could not connect to MongoDB at ${localURI}.`);
    console.warn(`Error: ${localError.message}`);
    console.warn(`-> Make sure MongoDB is running locally (e.g. run "mongod") OR update MONGO_URI in backend/.env.`);
    console.warn(`-> The server will remain alive with in-memory persistence fallback for immediate testing.\n`);
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
