const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
    {
    firstName:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20,
        trim:true
    },
    lastName:{
        type:String,
        minLength:2,
        maxLength:20,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        maxLength:20,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error("Invalid Email ID: " + value);
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not Strong" + value);
            }
        }
    },

    resetPasswordToken:{
        type:String,
        require: false
    },
    resetPasswordExpires:{
        type:Date,
        require:false,
    },

    age:{
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male" , "female" , "others"].includes(value)){
                throw new Error("Gender is not Valid!");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://fileinfo.com/img/ss/xl/jpg_44-2.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL: " + value);
            }
        }

    },
    discription:{
        type:String,
        default:"This is description",
        maxLength:100,
    },
    skills:{
        type:[String],
        maxLength:100,
    },
    },
    {
        timestamps:true,
    }
)

userSchema.methods.hashPassword = async function(password){
    return await bcrypt.hash(password , 10)
}

userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id} , "CODE@CAFE2025" , {expiresIn:"7d"});

    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash);
    return isPasswordValid;

}
module.exports = mongoose.model("User" , userSchema);