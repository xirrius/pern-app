import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const Register = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: ""
  });

  const { email, password, name } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value }); // form input handling

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { email, password, name }; // form data object m store kiya
      const response = await fetch(
        "http://localhost:5000/authentication/register", // send request to register route of server
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

      // YES IT IS SAME AS LOGIN - frontend logic mainly same h, difference backend logic m aata h. jha ek jgh user create ho rha vhi dusri jgh wo verify kiya jaa rha

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        setAuth(true); // ye isAuthenticated ko true karega inside of app.js
        toast.success("Register Successfully");
      } else {
        setAuth(false);
        toast.error(parseRes); // yha hm backend m set kiye gye error ko display bhi kr skte h frontend m
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="mt-5 text-center">Register</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="email"
          value={email}
          placeholder="email"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="password"
          name="password"
          value={password}
          placeholder="password"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <input
          type="text"
          name="name"
          value={name}
          placeholder="name"
          onChange={e => onChange(e)}
          className="form-control my-3"
        />
        <button className="btn btn-success btn-block">Submit</button>
      </form>
      <Link to="/login">login</Link>
    </Fragment>
  );
};

export default Register;
