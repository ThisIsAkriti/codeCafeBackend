const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");
const USER_SAVE_DATA = "firstName  lastName  age photoURL  about skills";

userRouter.get("/user/request/received" , userAuth , async(req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser,
            status:"interested"
        }).populate("fromUserId" , USER_SAVE_DATA)
        res.json({
            message:"Data Fetched Successfully!",
            data: connectionRequest
        })
    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
});

userRouter.get("/user/connection" , userAuth , async(req , res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {fromUserId:loggedInUser._id , status : "accepted"},
                {toUserId:loggedInUser._id , status:"accepted"}
            ]
        }).populate("fromUserId" , USER_SAVE_DATA)
        .populate("toUserId" , USER_SAVE_DATA)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
        console.log({connectionRequest});
    }catch(err){
        res.status(404).send("Error: " + err.message );
    }
});

userRouter.get("/user/feed" , userAuth , async(req ,res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50? 50 : limit;
        const skip = (page - 1)* limit;

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id} , 
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin : Array.from(hideUserFromFeed)}},
                {_id: {$ne : loggedInUser._id}},
            ],
        }).select(USER_SAVE_DATA).skip(skip).limit(limit);
        
        res.json({
            data:users , message:"Users shown on feed: "
        });

    }catch(err){
        res.status(404).send("Error : " + err.message);
    }
})

module.exports = userRouter;