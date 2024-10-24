require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");

//middleware

app.use(cors());
app.use(express.json());

//routes

const authRouter = require("./routes/jwtAuth")

app.use("/authentication", authRouter);

app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});

// OAuth - a protocol or structure , jwt - open standard
// auth.js, passport.js - libraries that provide authorization and authentication
// auth0 - platform as a service 