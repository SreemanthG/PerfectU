const User = require('../models/user');
const jwt = require('jsonwebtoken') //to generate signed token
const expressJwt = require('express-jwt'); //for authorization check
const {errorHandler} = require('../helpers/dbErrorHandler');


//signup
exports.signup = (req,res) => {
  // res.send({message: "please work"});
  // console.log('req.body',req.body);   
   const user = new User(req.body);
   user.save((err,user) => {
       if(err){
          return res.status(400).json({
              error: errorHandler(err)
          });
       }

     user.salt = undefined;
     user.hashed_password = undefined;
     res.json({
          user
      });
  });
};

//signin
exports.signin = (req,res) => {
 //find user based on email
  const {email,password} = req.body;
  User.findOne({email},(err,user) => {
    if(err ||!user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please Sign up"
      });
    }

    //if user is found make sure email and password match
    // create authenticate method in user model
    if(!user.authenticate(password)) {
      return res.status(401).json({
       error: "Email and Password do not match"
      });
   }

   //generate a signed token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
   //persist the token as 't' in cookie with expiry date
    res.cookie('t',token,{expire: new Date()+9999});
    //return response with user and token to frontend client
    const {_id,name,email,role} = user;
    return res.json({
      token,user:
       {_id,
        email,
        name,
      }
    });
 });
};

//signout
exports.signout = (req,res) => {
  res.clearCookie('t');
  res.json({
    message: "Signout succesful"
  });
};

//requireSignin
exports.requireSignin =  expressJwt ({
  secret: "something great secret",
  requestProperty: "auth",
  algorithms:["HS256"]

});

//auth middleware
exports.isAuth = (req,res,next) => {
  
  let user =  req.profile._id && req.auth._id && req.profile._id == req.auth._id 
  console.log(user);
   if(!user){
     return res.status(403).json({
       error: "Access denied"
    });
  
  }
 // res.json({ user });
  next();
};

//admin middleware
exports.isAdmin= (req,res,next) => {
   if(req.profile.role === 0){
     return res.status(403).json({
       error: "Not an Admin! Access denied"
    });
   }
  next();
};