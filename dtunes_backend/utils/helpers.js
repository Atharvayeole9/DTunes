// contains all the functions that are needed at many places
const jwt=require("jsonwebtoken");

exports={}

exports.gettoken=async (email,user) =>{
    const token =jwt.sign({identifier: user._id},"thiskeywillbesecret"); //.sign() add a cryptographic signature to token which helps to verify user when token is arrived
    //_id is assigned to user by MongoDB by default
    return token;
};

module.exports=exports;