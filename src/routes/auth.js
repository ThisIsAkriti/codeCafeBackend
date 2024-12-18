const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const app = express();
app.use(express.json());
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup" , async(req, res) => {
    try{
        validateSignUpData(req);
        const {firstName , lastName , emailId , password} = req.body;
        const passwordHash = await bcrypt.hash(password , 10)
        const user = new User({
            firstName , 
            lastName ,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("User added successfully!");
    }catch(err){
        res.status(400).send("Error in Signing Up: " + err.message);
    }
}) 

authRouter.post("/login" , async(req,res) => {
        try{
            const {emailId , password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials email!"});
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);
        if(isPasswordValid){ 
            const token = jwt.sign({_id: user._id} , "CODE@CAFE2025" , {expiresIn:'1h'});
            res.cookie("token" , "asldjfnwoierfsdfASDFdfsdfgrgtfjklkfgbvrtgghj");

            res.cookie("token" , token);
            return res.send(user)
        }else{
            return res.send("Invalid Credentials!")
        }
    }catch(err){
        return res.status(400).send("Invalid Credentials!") 
    }
})
authRouter.post("/logout" , async(req, res) => {
    res.cookie("token" , null , {
        expires:new Date(Date.now()),
    } )
    res.send("Logout Successful!")
})
module.exports = authRouter;