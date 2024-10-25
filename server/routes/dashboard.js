const router = require("express").Router(); // router object using express.Router
const authorize = require("../middleware/authorize");
const pool = require("../db");

// localhost:3000/
// yha hmne authorize middleware pass kiya, iska mtlb ki route '/' pr jo bhi post request aayegi wo pehle authorize function m jayegi fir yha aayegi
// agr request yha tk aa gyi toh iska mtlb request ke paas valid token h. jisko verify krke hme payload mila. uss payload ko hmne req.user m store kiya tha (refer to authorize.js)

router.post("/", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user.id] // fetching user data from userid
    );

    res.json(user.rows[0]); // return user data
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
