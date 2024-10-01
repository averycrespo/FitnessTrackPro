const jwt = require('jsonwebtoken');
require('dotenv').config();

const TOKEN_COOKIE_NAME = "FitnessTrackPro";
// In a real application, you will never hard-code this secret and you will
// definitely never commit it to version control, ever
const API_SECRET = process.env.JWT_SECRET;

exports.TokenMiddleware = (req, res, next) => {
    // We will look for the token in two places:
    // 1. A cookie in case of a browser
    // 2. The Authorization header in case of a different client
    let token = null;
    if(!req) {
      console.log(req);
    }
    if(!req.cookies[TOKEN_COOKIE_NAME]) {
      //No cookie, so let's check Authorization header
      const authHeader = req.get('Authorization');
      if(authHeader && authHeader.startsWith("Bearer ")) {
        //Format should be "Bearer token" but we only need the token
        token = authHeader.split(" ")[1].trim();
      }
    }
    else { //We do have a cookie with a token
      token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
    }
  
    if(!token) { // If we don't have a token
      res.status(401).json({error: 'Not authenticated'});
      return;
    }
  
    //If we've made it this far, we have a token. We need to validate it
  
    try {
      const decoded = jwt.verify(token, API_SECRET);
      req.user = decoded.user;
      next(); //Make sure we call the next middleware
    }
    catch(err) { //Token is invalid
      res.status(401).json({error: 'Not authenticated'});
      return;
    }
  
  
  }
  
  
exports.generateToken = (req, res, user) => {
    let data = {
        user: user,
        // Use the exp registered claim to expire token in 1 hour
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
    }

    const token = jwt.sign(data, process.env.JWT_SECRET);
    // console.log("GENERATED A TOKEN");

    //send token in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000 //This session expires in 15 minutes.. but token expires in 1 hour!
        });
};


exports.removeToken = (req, res) => {
    //send session ID in cookie to client
    res.cookie(TOKEN_COOKIE_NAME, "", {
        httpOnly: true,
        secure: true,
        maxAge: -360000 //A date in the past
    });

}  