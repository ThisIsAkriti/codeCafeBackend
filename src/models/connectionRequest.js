const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored" , "interested" , "rejected" , "accepted"],
            maessage:`{VALUE} is incorrect status type`,
        }
    }
},
{
    timestamps:true
})

//compound index
connectionRequestSchema.index({fromUserId:1 , toUserId:1});

connectionRequestSchema.pre("save" , function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});
const connectionRequest = new mongoose.model(
    "ConnectionRequest" , 
    connectionRequestSchema
)
module.exports = connectionRequest; 