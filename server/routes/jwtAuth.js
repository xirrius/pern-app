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
    
    // configure bcrypt and password hashing
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    // create new user
    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );
    // generate jwt token
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  // destructure email and password
  const { email, password } = req.body;

  try {
    // search for the user
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    // check whether user is present or not in database
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }
    // verify the user - Authentication
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    // generate jwt token
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;