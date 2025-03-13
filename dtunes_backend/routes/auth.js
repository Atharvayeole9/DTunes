const express=require("express");
const router=express.Router(); //we create one extra variable to store properties of express() because many times we don't want to 
    //use all the functionalities of package like here we only want .Router()
const User=require("../models/user");
const bcrypt=require("bcrypt");
const {gettoken}=require("../utils/helpers");

//This post route will help in registering a user
router.post("/register", async (req,res)=>{
    //this code runs when /register API is called as POST request
    //My req.body will be of the form {email,password,username,firstname,lastname}

    //step 1: set variables with respect to req.body
    const {email,password,username,firstname,lastname} = req.body; //this we can do only if req.body is in json format

    //step 2: verify whether a user already exists, if yes then throw a error because, then no need to register
    //all the findOne types of functions are needed to be executed asynchronously. Or all the database searching functions??
    const user=await User.findOne({email:email}); //findOne() is a mongoose function, which finds the required object out of all the objects 
                              //of a particular model. Still there is no need to require mongoose because user model already has it
    if(user){
        //default status code for returning a json file is 200 but it is a convention that the authentication errors typically have 400 status code
        return res
            .status(400)
            .json({error:"User already exists"});
    }
    //else it is a valid request\

    //step 3:create a new user in DB
    //step 3.1:we cannot keep passwords of data directly saved in our database, due to security issue
    //else we will have to hash it before storing it
    const hashedpassword=await bcrypt.hash(password,10); //10 signifies level of seccurity if level inc. perf dec. ;10 is optimal for our product
    //console.log(hashedpassword);
    const newuserdata={email,password:hashedpassword,username,firstname,lastname};
    //console.log(newuserdata);
    const newUser=await User.create(newuserdata);

    //step 4:we need to create a token to return to the user, as explained in  jwt
    const token=await gettoken(email,newUser); //present is helper.js of utils folder

    //step 5:return the result to user
    //console.log(token);
    const usertoreturn={...newUser.toJSON(),token};
    //console.log(newUser.password);
    // console.log("hi");
    // console.log(token);
    // console.log(usertoreturn);
    delete usertoreturn.password;
    return res.status(200).json(usertoreturn);
});

router.post("/login", async (req,res)=>{
    //step 1:get the email and password of user
    const {email,password}= req.body;
    //step 2:check if the user with given email exists.
    const user=await User.findOne({email:email});
    if(!user){
        return res.status(400).json({error:"Invalid email"});
    }
    //step 3:check if the password assocaited with given user is correct
    //we can convert password to hash but not hash to password back
    //console.log(password);
    //console.log(user.password);
    const ispasswordvalid=await bcrypt.compare(password,user.password);
    if(!ispasswordvalid){
        return res.status(400).json({error:"Invalid password"});
    }
    //step 4:if the credentials are correct return token to user
    const token=await gettoken(user.email,user); //present is helper.js of utils folder
    const usertoreturn={...user.toJSON(),token};
    delete usertoreturn.password;
    return res.status(200).json(usertoreturn);
})
//learn what is sessions in autorisation

module.exports=router;
