require('dotenv').config() // no need to use const. because require automatically runs the module (IT WILL NOT RUN A FUNCTION IN THE MODULE UNLESS IT IS CALLED)
const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors()); // server foreign sources se bhi request receive karega, not just localhost 5000
app.use(express.json()); // aati hui request ko json format m convert krta h

//routes

const authRouter = require("./routes/jwtAuth") // one way to define a router

app.use("/authentication", authRouter); // authentication pr aane wali saari requests ab authRouter handle karega

app.use("/dashboard", require("./routes/dashboard")); // another way to define a router

app.use("/posts", require("./routes/posts"));

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});

// OAuth - a protocol or structure , jwt - open standard
// auth.js, passport.js - libraries that provide authorization and authentication
// auth0 - platform as a service 

// Using http status codes in your responses - 
// return res.json(data) - normally
// return res.status(200).json(data) - with status code. client ko response ka nature smjh aayega. best practice