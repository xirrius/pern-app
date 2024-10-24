// middleware that only checks that user ne jo data login ya register m enter kiya vo valid h ki nhi
// agr invalid h toh yhi se error response bhej diya jayega. controller run nhi honge

module.exports = function (req, res, next) {
  const { email, name, password } = req.body; // request body se data destructure kr rhe 

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail); 
    // ye email pattern ka ek regular expression h jo test() function ke sath check kr rha ki email valid h ya nhi. For example - email must have @, etc.
    // this function returns boolean value
  }

  if (req.path === "/register") { // register pr request aayi mtlb user ne register kiya h
    console.log(!email.length);
    if (![email, name, password].every(Boolean)) { // name, email, password koi field empty nhi honi chahiye, empty === false
      return res.status(400).json("Missing Credentials"); // return error response
    } else if (!validEmail(email)) { // email valid hona chahiye
      return res.status(400).json("Invalid Email"); // return error
    }
  } else if (req.path === "/login") { // login pr request aayi mtlb user ne login kiya h
    if (![email, password].every(Boolean)) {  // same as register
      return res.status(400).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(400).json("Invalid Email");
    }
  }

  next(); // passing the request and response objects to the next middleware in case no response is sent from here.
};
