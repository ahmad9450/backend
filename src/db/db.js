import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DB_NAME from '../constant.js';
dotenv.config();

const connectDb = async () => {
  try {
    const fullUri = `${process.env.MONGODB_BASE_URI}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(fullUri);
    console.log(`✅ MongoDB connected at ${connectionInstance.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);  // Exit process with failure
  }
};

export default connectDb;