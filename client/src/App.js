import React, { Fragment, useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { toast } from "react-toastify";

//components

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

toast.configure();


// PRIVATE ROUTE LOGIC
// m logged in hu tb hi mjhe permission h dashboard route ("/") ko access krne ki. uske liye mere paas token hona chahiye. agr esa nhi h toh app mjhe seedha '/login' route pr redirect kar dega
// agr m logged in hu, aur m register ya login route pr hu toh mjhe "/" pr redirect kar dega automatically


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // it is true when i am logged in. i am logged in when i have valid jwt token. 
  // remember backend m jb login ya register successful hota tha tb jwt token generate krte the aur send krte the res m


  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/authentication/verify", { // verifying if i am logged in or not.
        method: "POST",
        headers: { jwt_token: localStorage.token },  // passing token jo client ne store kiya tha local storage m
      });

      const parseRes = await res.json(); 
      // yaad kro backend m verify api ya toh true degi, ya toh error response

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false); 
      // agar true h toh isAuthenticated bhi true kr do. mtlb m logged in hu. otherwise false

    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    checkAuthenticated(); // ye kaam sirf component ke initial render pr chalega
  }, []);

  // custom function isAuthenticated ko set krne ke liye jo hum children component m pass kr skte h as props. 
  // setAuth(true) se hmara state variable isAuthenticated true ho jayega, kisi bhi child component ke andr se
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean); 
  };

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>

            {/* if i am not logged in, show log in component. Else redirect me to dashboard */}
            <Route
              exact
              path="/login"
              render={(props) =>
                !isAuthenticated ? (
                  <Login {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />

            {/* if i am not logged in, show register component. Else redirect me to dashboard */}
            <Route
              exact
              path="/register"
              render={(props) =>
                !isAuthenticated ? (
                  <Register {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            
            {/* if i am logged in, show dashboard component. Else redirect me to login */}
            <Route
              exact
              path="/"
              render={(props) =>
                isAuthenticated ? (
                  <Dashboard {...props} setAuth={setAuth} />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
