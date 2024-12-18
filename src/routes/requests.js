const { userAuth } = require("../middlewares/auth");
const User = require("../models/user"); 
const ConnectionRequest = require("../models/connectionRequest"); 
const express = require("express");
const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:toUserId" , userAuth , async(req , res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored" , "interested"];

        if(!allowedStatus.includes(status)){
            throw new Error("Status Invalid: " + status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message:"User is not defined!"
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send("Connection request already exist!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        const data = await connectionRequest.save();

        res.json({
            message:`${req.user.firstName} ${status === "interested"? "is interested in" : "ignored"} ${toUser.firstName}`,
            data
        })
    }catch(err){
        res.status(404).send("Error : " + err.message);
    }

})
requestRouter.post("/request/review/:status/:requestId" , userAuth , async(req , res) => {
    try{
        const loggedInUser = req.user;
        const status  = req.params.status;
        const requestId = req.params.requestId;
        const allowedStatus = ["accepted" , "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(404).send("Status is not valid: " + status);
        };
        
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });
        if(!connectionRequest){
            return res.status(404).send("Connection Request not found!");
        };
        connectionRequest.status = status;
        const fromUser = await User.findOne(connectionRequest.fromUserId);
        
        const data = await connectionRequest.save();

        res.json({
            message:`${req.user.firstName} ${status} ${fromUser.firstName}'s connection request` ,
            data
        })
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})
module.exports = requestRouter;