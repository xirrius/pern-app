import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/dashboard/", { // send req to dashboard route in backend
        method: "POST", // specify method
        headers: { jwt_token: localStorage.token } // other options
      });

      const parseData = await res.json(); // converting strigified data to json
      setName(parseData.user_name); // user data jo response se mila wo hm isme set kr de rhe
    } catch (err) {
      console.error(err.message);
    }
  }; 

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token"); // token ko delete kr diya. No token mtlb not logged in. Toh private route access not allowed, ye isAuthenticated ki value handle karegi app.js m
      setAuth(false); // isAuthenticated is false now
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile(); // user data ya username fetch krne ke liye
  }, []);

  return (
    <div>
      <h1 className="mt-5">Dashboard</h1>
      <h2>Welcome {name}</h2>
      <button onClick={(e) => logout(e)} className="btn btn-primary">
        Logout
      </button>
      <Link to="/posts" className="btn btn-primary">Posts</Link>
    </div>
  );
};

export default Dashboard;
