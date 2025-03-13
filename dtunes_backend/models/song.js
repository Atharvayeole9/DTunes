const mongoose=require("mongoose");

const song= new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    artist: {
        type : mongoose.Types.ObjectId,
        ref : "user",
    },
    thumbnail: {
        type : String,
        required : true,
    },
    track: {
        type : String,
        required : true,
    },
});

const songmodel=mongoose.model("Song",song); //first argument is the name of collection and second one is schema.
//.model() creates a copy of schema 'user' and name it as user
//by calling this line mongoose compiles schema for us 

module.exports=songmodel; //if any other file import "Userr.js", it will import usermodel model..