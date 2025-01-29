require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined');
    }
    const conn = await mongoose.connect(process.env.MONGO_URI , {});
  } catch (error) {
    console.error(`Database connection failed... ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
