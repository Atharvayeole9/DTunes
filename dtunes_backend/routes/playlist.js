const express=require("express");
const router=express.Router();
const passport=require("passport");
const Song=require("../models/song");
const User=require("../models/user");
const Playlist=require("../models/playlist");
//const User=require("../models/user");

router.post("/create",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    //req.user gets the user becuase of password.authenticate
    //console.log("hi");
    const currentuser=req.user;
    const {name,thumbnail,songs} =req.body;
    if(!name || !thumbnail || !songs){
        res.status(400).json("Insufficient details to create a song");
    }
    const newplaylistdetails={name,thumbnail,songs,owner:currentuser._id};
    const newplaylist=await Playlist.create(newplaylistdetails);
    return res.status(200).json(newplaylistdetails);
});

router.get("/get/myplaylist",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    const currentuser=req.user;
    //we have to find the all the songs where artist id==currentuser._id
    const playlist=await Playlist.find({owner: currentuser._id});
    return res.status(200).json({data:playlist}); //this syntax used when i want to send a list as response
});

//here the route is "/get/:playlistID" ,':' tells us that 'playlistID' is a variable that means it is not necessary to call /get/:playlistID instead if i call /get/abcdefg still this api will be called
router.get("/get/playlist/:playlistID",passport.authenticate("jwt",{session: false}),async(req,res)=>{
    //since,this is a get request i will not req to this so, i cannot get the playlist id from req.body so, i will take that using req.params.playlistID
    const playlistID=req.params.playlistID;
    const playlist=await Playlist.findOne({_id:playlistID});
    if(!playlist){
        return res.status(400).json("Incorrect Playlist ID");
    }
    return res.status(200).json(playlist);
})

//get all the playlist of a particular arstist
router.get("/get/artist/:artistID",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const artistID=req.params.artistID;
    const playlists=await Playlist.find({owner:artistID});
    const user=User.findOne({_id:artistID});
    if(!user){
        return res.status(400).json("Incorrect artist ID");
    }
    return res.status(200).json(playlists);
})

//adding a song to playlist
router.post("/add/song",passport.authenticate("jwt",{session:false}),async (req,res)=>{
    const user=req.user;  //where does .user come from
    const {playlistID,songID} =req.body;
    //step 1: check whether there exist any playlist with given ID where 
    const playlist=await Playlist.findOne({_id:playlistID});
    if(!playlist){
        return res.status(400).json("Invalid playlistID");
    }
    //step 2:check whether this given user is owner or collaborator for this playlist
    const playlistowner=playlist.owner; 
    console.log(playlistID + " " +playlistowner + " " + user._id);
    const playlistcollaborators=playlist.collaborators;
    var flg=0;
    playlistcollaborators.forEach(collaborator => {
        if(collaborator==user._id)flg=1;
    });
    console.log(flg);
    console.log(playlistowner._id!=user._id);
    if(playlistowner._id!=user._id && !flg){
        return res.status(400).json("You do not have access to make changes in given playlist");
    }
    //step 3: check whether a song with given songID exixts or not 
    const song=Song.findOne({_id:songID});
    if(!song){
        return res.status(400).json("Invalid songID");
    }
    //step 4: append the song to playlist.songs
    const playlistsongs=playlist.songs;
    playlistsongs.append(songID);
    await playlist.save();
    return res.status(200).json(playlist);
})
module.exports=router;