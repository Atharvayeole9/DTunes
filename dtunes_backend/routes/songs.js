const express=require("express");
const router=express.Router();
const passport=require("passport");
const Song=require("../models/song");
const User=require("../models/user")

router.post("/create",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    //req.user gets the user becuase of password.authenticate
    //console.log("hi");
    const {name,thumbnail,track}=req.body;
    if(!name || !thumbnail || !track){
        res.status(400).json("Insufficient details to create a song");
    }
    const user=req.user;
    const artist=user._id;
    //console.log("hi");
    const songdetails={name,thumbnail,track,artist};
    const createdsong=await Song.create(songdetails);
    //console.log("hi");
    return res.status(200).json(songdetails);
});

router.get("/get/mysongs",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    const currentuser=req.user;
    //we have to find the all the songs where artist id==currentuser._id
    const songs=await Song.find({artist: currentuser._id});
    return res.status(200).json({data:songs}); //this syntax used when i want to send a list as response
});

//getting songs from artist name
router.get("/get/song/:artistID",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    //we have to find the all the songs where artist id==currentuser._id
    //const {artistID}=req.body;
    const artistID= req.params.artistID;
    const artist=User.find({_id:artistID});
    if(!artist){
        return res.status(200).json("Artist does not exist");
    }
    const songs=await Song.find({artist: artistID});
    return res.status(200).json({data:songs}); //this syntax used when i want to send a list as response
});

//getting songs from song name
router.get("/get/songname/:songname",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    //const {songname}=req.body;
    const songname=req.params.songname;
    //we can add pattern matching to this instead of direct name matching like i should get result for vanilla by typing vanila
    //pattern matching - MongoDB queries
    const songs=await Song.find({name: songname});
    return res.status(200).json({data:songs}); //this syntax used when i want to send a list as response
})
module.exports=router;