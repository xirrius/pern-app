const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenertor");
const authorize = require("../middleware/authorize");

router.post("/register", validInfo, async (req, res) => {
  // destructure email, name and password
  const { email, name, password } = req.body;

  try {
    // check whether user already exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }
    

    // Now we begin PASSWORD HASHING
    // to protect user privacy and data, hm database m kbhi actual password nhi store krte h. hamesha use hash krte h (ek random language m convert krte jo original se bikul alag h)
    // jb user login karega toh hashed password ko unhash krke compare kiya jata h.
    // BUT NEVER STORE ORIGINAL PASSWORD


    // genSalt() ek function h jo salt return krta h. 
    // salt is a random string attached to password before hashing
    // agr 2 log ka pw same bhi hua toh unka salt different hoga
    // 10 represent number of rounds in salt generation. jitne rounds utni complexity
    const salt = await bcrypt.genSalt(10); 

    // hash password and salt lega aur ek hashed string return karega
    const bcryptPassword = await bcrypt.hash(password, salt);
    
    // create new user
    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword] // store user in database with hashed pw
    );
    // generate jwt token so client is authorized to access routes
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken }); // return token
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  // destructure email and password
  const { email, password } = req.body;

  try {

    // AUTHENTICATION BEGINS
    // search for the user using email entered by client
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    // check whether user is present or not in database
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential"); // if user does not exist then how can i login
    }

    // compare(), db m stored hashed password ko unhash krta h aur client ke entered password se compare krta h
    // if dono equal h toh true return karega else false

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential"); // pw galat. you do not own this account. 
    }
    // generate jwt token. server sends this client to be authorized when accessing routes.
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
 
// just a simple route
// agr authroized h toh true return hoga
// unauthrozed h toh request yha kabhi nhi aayegi. it will stop at authorize middleware

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;