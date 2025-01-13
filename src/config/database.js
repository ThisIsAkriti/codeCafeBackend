require('dotenv').config();
const mongoose = require("mongoose");
const connectDB = async() => {
    await mongoose.connect(process.env.MONGODB_ID);
};

module.exports = connectDB;