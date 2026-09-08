import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/swiggy_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection error: ${error.message}`);
    console.warn(`👉 The server will run in Hybrid/Memory mode using pre-seeded Swiggy restaurants and mock database.`);
    console.warn(`👉 To connect a real database, set MONGODB_URI in server/.env (e.g. MongoDB Atlas connection string).`);
    return false;
  }
};

export const getDBStatus = () => isConnected;

