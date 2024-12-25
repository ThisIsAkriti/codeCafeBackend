const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile/view" , userAuth , async(req, res) => {
    try{
        const findUser = await req.user;
        res.send(findUser);
    }catch(err){
        res.status(404).send("Error Profile " + err.message);
    }
});

profileRouter.patch("/profile/edit" , userAuth , async(req , res) => {
    try{
        if(!validateEditProfileData){
            throw new Error("Invalid Edit Request!");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.send({
            message:`${loggedInUser.firstName}'s profile updated succesfully!`,
            data:loggedInUser
        })
    }catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
});

profileRouter.post("/profile/forgotPassword" , userAuth , async(req , res) => {
    const {emailId} = req.body;
    try{
        const user = await User.findOne({emailId});
        if(!user){
            return res.send("User not found!");
        }
        const token = Math.random().toString(36).substring(2);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        console.log(`Reset password token for ${emailId} is ${token}`);
        res.status(200).send("Password Reset Token");

    }catch(err){
        res.status(404).send("Error: " + err.message)
    }

})
profileRouter.post("/profile/resetPassword/:token", userAuth, async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        console.log("Received token:", token);
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        console.log("Query: resetPasswordToken =", token);
        console.log("Query: resetPasswordExpires >", Date.now());
        console.log("Found user:", user);

        if (!user) {
            return res.send("User is not found!");
        }

        user.password = await user.hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.send({ message: "Password has been reset successfully!" });
    } catch (err) {
        console.error("Error:", err);
        res.status(404).send("Error: " + err.message);
    }
});

module.exports = profileRouter