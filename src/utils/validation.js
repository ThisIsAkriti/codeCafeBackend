const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName , lastName , emailId , password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email id is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Strong.");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "fistName",
        "lastName",
        "age",
        "about",
        "skills"
    ];
    const isAllowedEdits = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isAllowedEdits;
}
module.exports = {
    validateSignUpData,
    validateEditProfileData
}