const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async(req , res , next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please Login!")
        }
        const decodeObj = jwt.verify(token , process.env.TOKEN_SECRET_PASSWORD)
        const {_id} = decodeObj;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found!");
        }
        req.user = user;
        next();

    }catch(err){
        res.status(404).send("Error:" + err.message);
    } 
}
module.exports = {
    userAuth,
}