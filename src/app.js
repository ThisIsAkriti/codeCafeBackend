const express = require("express");
require("./config/database");
const connectDB = require("./config/database")
const app = express();

connectDB().then(() => {
    console.log("Database connection established...");

    app.listen(3000 , () => {
        console.log("Server listening to port 3000!");
    });
    
}).catch(err => {
    console.error("Database connection failed...")
})