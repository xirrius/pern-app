const jwt = require("jsonwebtoken");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("jwt_token"); // fetching the jwt_token key-value pair from header object inside of request
  // request {
    // header : {
    //   "jwt_token" : token
    // }
  // }

  // Check if not token
  if (!token) { // agr token nhi provided h header m then return error. No pass no entry in party
    return res.status(403).json({ msg: "authorization denied" });
  }

  // Verify token. verify that ye pass, party organizer ne hi issue kiya h. fake nhi h.
  try {
    const verify = jwt.verify(token, process.env.jwtSecret); // yha humne token ko pass kiya. aur server ki secret key pass ki. to verify
    // in case token is valid, jwt.verify will return payload
    //it is going to give verify = {user:{id: userid}}
    // if token is invalid, it will throw error and we move to catch block

    req.user = verify.user; // req object m payload store kr liya 

    // req {
    // user : {
    //   id: userid
    // }}

    next();
    
  } catch (err) {
    res.status(403).json({ msg: "Token is not valid" });
  }
};
