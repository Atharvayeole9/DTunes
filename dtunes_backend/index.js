//npm init
//npm i express

const mongoose=require("mongoose");
const express=require("express"); // gives functionality of all the modules of express to variable named express
const app=express(); //variable express is exported as a function. i am putting all functionalities of express function into a variable app
//the last two lines are essential to use functionalities of node modules in our local file
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt; //these 2 are used in user authentication-> password-jwt
const passport=require("passport");
const User=require("./models/user");
const authRoutes=require("./routes/auth");
const songRoutes=require("./routes/songs");
const playlistRoutes=require("./routes/playlist");
require('dotenv').config();
const port=8000;

app.use(express.json()); //always converts my req.body to a json file.it is needed for step 1 in /register of auth.js
//console.log(process.env.MONGO_PASSWORD);
//User.deleteMany({password:null});
//connect mongodb to our node app
mongoose.connect(
    "mongodb+srv://Atharva1:"+process.env.MONGO_PASSWORD2+"@songs.qli3t6d.mongodb.net/?retryWrites=true&w=majority&appName=songs",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then((x)=>{
    console.log("Connected to MongoDB!!");
})
.catch((err)=>{
    console.log("error while connecting!!!",err);
});
//2 arguments=> 1.which db to connect(db url), 2.connection options
//i cannot give my password into url because of security issue
//instead of putting my password i am putting "process.env.MONGO_PASSWORD", when i am running app on my system, MONGO_PASSWORD=my password

//when user is running in his system, MONGO_PASSWORD=his password
//passport used for user authentication
//we are doing this using passport-jwt, it is token which a request brings with it, if a request has it then my server will come 
//to know that this is logged in user
//setup password-jwt
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extracting token from the recieved request
opts.secretOrKey = 'thiskeywillbesecret'; //secret key used to verify the jwt signature
//console.log(opts);
passport.use(new JwtStrategy(opts,function(jwt_payload, done) { //jwt_payload=decoded jwt
    //console.log(jwt_payload.identifier);
    User.findOne({ _id: jwt_payload.identifier})
    .then(user => {
        if (user) {
            //console.log(user.email);
            return done(null, user);
        } else {
            //console.log("no such user");
            return done(null, false);
        // or you could create a new account
        }
    })
    .catch(err => {
        return done(err, false);
    });
}));
//taken from passport jwt website

//creating a "GET type" API which return text 'Hello world' on '/'
app.get("/",(req,res)=>{
    //"/" signify the root route
    //req contains all data for request
    //res contians all data for response
    res.send("Hello world");
});
app.use("/auth",authRoutes); //whenever i encounter site.com/auth this will be invoked and further if the url is 
                            // site.com/auth/register then "/register" route in auth.js is executed
app.use("/songs",songRoutes);
app.use("/playlist",playlistRoutes);

//we are telling express that our server will run on localhost:8000
app.listen(port,()=>{
    console.log("my app is running on "+port);//output when server starts
});
//till this was the use of express .This was the backend setup

// "start": "react-scripts start",
//     "build": "react-scripts build",
//     "test": "react-scripts test",