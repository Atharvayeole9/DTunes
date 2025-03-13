const mongoose=require("mongoose");

const playlist= new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    owner: {
        type : mongoose.Types.ObjectId,
        ref : "user",
    },
    thumbnail: {
        type : String,
        required : true,
    },
    // track: {
    //     type : String,
    //     required : true,
    // },
    // 1.kaunse songs hai
    // 2.playlist collaborators
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref : "song",
        },
    ],
    collaborators: [
        {
            type: mongoose.Types.ObjectId,
            ref : "user",
        },
    ],
});

const songmodel=mongoose.model("Playlist",playlist); //first argument is the name of collection and second one is schema.
//.model() creates a copy of schema 'user' and name it as user
//by calling this line mongoose compiles schema for us 

module.exports=songmodel; //if any other file import "Userr.js", it will import usermodel model..