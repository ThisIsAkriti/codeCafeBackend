const mongoose = require("mongoose");
const connectDB = async() => {
    await mongoose.connect("mongodb+srv://codeCafeBackend:CdrGljkLyEW22FHc@codecafebackend.493j3.mongodb.net/")
};

module.exports = connectDB;