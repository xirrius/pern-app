const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  }; // ye sirf ek object h jisko hmne payload naam diya aur hm isme koi bhi value de skte h. jese user id

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" }); 
  // jwt.sign token create krta h. we pass payload, server ki secret key, aur kuch options jese expiry
  // jwt.sign hme token return krta h jo ek string hoti h
}

module.exports = jwtGenerator;
