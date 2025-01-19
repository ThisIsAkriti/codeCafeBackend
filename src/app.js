
require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);

connectDB().then(() => {
    console.log("Database connection established...");

    app.listen(3000 , () => {
        console.log("Server listening to port 3000!");
    });
    
}).catch(err => {
    console.error("Database connection failed..." , err)
})