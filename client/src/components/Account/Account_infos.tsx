import React from 'react';
import '../login/login.css'
import {Routes, Route, useNavigate} from 'react-router-dom';
import Account from './Account';
import { useState } from "react";
import person from '../users/users.json'
import OneTimeProfilePicUpload from '../Account/OneTimeProfilePicUpload';

const Pseudo = () => {
  const users = [{ username: "Jane", password: "testpassword" ,pseudo: ""}];
  
return (
    <div>

    <OneTimeProfilePicUpload/>
    </div>
  )
};
export default Pseudo;
