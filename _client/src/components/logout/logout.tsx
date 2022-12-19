import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState } from "react";

const LogOut = () => {
  const [authenticated, setauthenticated] = useState("");
  const navigate = useNavigate();

  const LogOut = () => {
       
        const loggedInUser = localStorage.getItem("authenticated");
        console.log("Before  : " + loggedInUser);
        if (loggedInUser == "true")
        {   
            localStorage.setItem("authenticated", "false");
            setauthenticated("false");
            console.log("Logging out ..." + authenticated);
            navigate("/");
        }
    };
  return (
    <div>
     <button onClick={LogOut}>LogOut</button>
    </div>
  );
};
  
export default LogOut;