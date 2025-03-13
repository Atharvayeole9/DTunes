//models forlder contians all the models. Model tells what data about a particular thing we have like in user.js we will have feilds about what 
//data about each user we have. that is user.js will tell us "ek user kaisa dikhta hai?"
const mongoose=require("mongoose");
//step 1:require a mongoose 
//step 2:create a mongoose schema 
//step 3:create a model

const user= new mongoose.Schema({
    firstname: {
        type : String,
        required : true,
    },
    lastname: {
        type : String,
        required : false,  //by default required is false
    },
    email: {
        type : String,
        required : true,
    },
    username: {
        type : String,
        required : true,
    },
    likedsongs: {
        //we will change afterwards to array
        type: String,
        default: "",
    },
    likedplaylists: {
        //we will change afterwards to array
        type: String,
        default: "",
    },
    subscribedartists: {
        //we will change afterwards to array
        type: String,
        default: "",
    },
    password: {
        type: String,
    }
});

const usermodel=mongoose.model("User",user); //first argument is the name of collection and second one is schema.
//.model() creates a copy of schema 'user' and name it as user
//by calling this line mongoose compiles schema for us 

module.exports=usermodel; //if any other file import "Userr.js", it will import usermodel model..