import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });

  const { email, password } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value }); // handle form inputs

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password };
      const response = await fetch(
        "http://localhost:5000/authentication/login", // send req to login route of backend
        {
          method: "POST", // specify method
          headers: {
            "Content-type": "application/json", // specify other options
          },
          body: JSON.stringify(body), // req.body ko stringify krke bheja jata h always
        }
      ); // fetch will return response after some time. so we use await

      const parseRes = await response.json(); // stringified res ko json m convert kiya

      // remember - backend m login aur register hone pr token generate krte the aur ise return krte the response m

      // yhi token ab client chup-chap store kr lega, local storage m kyuki refresh krne pr state value fir se initial value ho jati h
      // fir local storage se get karenge jb bhi dashboard pr jana ho, ya check krna ho ki log in h ya nhi


      // YES IT IS SAME AS REGISTER - frontend logic mainly same h, difference backend logic m aata h. jha ek jgh user create ho rha vhi dusri jgh wo verify kiya jaa rha

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true);
        toast.success("Logged in Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <button class="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/register">register</Link>
    </Fragment>
  );
};

export default Login;
