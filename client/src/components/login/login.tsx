import React from 'react';
import './login.css'
import {Routes, Route, useNavigate} from 'react-router-dom';
import Account from '../Account/Account';
import { useState,useEffect } from "react";
import oauth2 from 'react-oauth2';
import { ClientRequest } from 'http';
import axios from 'axios'

const Login = () => {
  const [User42,SetUser42] = useState([]);
  const [authenticated, setauthenticated] = useState("");
  const [getCode,SetgetCode] = useState("");
  const [wantsLogin,setWantsLogin] = useState(false);

    const navigate = useNavigate();
    const navigateAccount = () => {
        // 👇️ navigate to /contacts
        navigate('/Account');
      };
    const navigate42 = () => {
      navigate('')
    }
 //------------------------------------//
//Oauth2
async function LogUserToBackend  (post) {

  console.log("Sending a request to Backend =>  ! " )
  const response =   await axios.post('http://localhost:8000/api/authentification/oauth2/School42?code=' + post.code, post)
 
    console.log("response from backend => " + response);
    // console.log(" From Login :  " + JSON.stringify(response.data));
    // setauthenticated("true");
    // SetUser42(response.data);
    // setuser(response.data);
    return (response.data)
    // navigateAccount();
  
};
const HandleSubmit = (e) => {
  e.preventDefault();
}

async function  HandleRef  ()  {
  // e.preventDefault();

  console.log("Inside handle ref => ");


  // const auth =   await 
  const endpoint = 'http://localhost:5000/auth/redirect'
  console.log(" this endpoint " + endpoint)
  fetch(endpoint,{mode:'no-cors'})
  .then((response) => {
// console.log("response Isghouia backend " + JSON.stringify(response));
  })

}

useEffect(() => {

  if(wantsLogin)
  {
    console.log("WANTS LOGIN IS TRUEEE")
    localStorage.setItem("wantslogin","true");
    // HandleRef();
  }
  // const previous = localStorage.getItem("wantslogin");
  // if (previous === "true")
  // {
  //   console.log("GOOD")
  //   HandleRef();

  // }
},[wantsLogin])
// useEffect(() => {
  
// try {

// const code = new URLSearchParams(window.location.search).get("code");
// if(code)

// {
//   SetgetCode(code);
// navigate('/');
// }
// if(getCode)
//   {
//     // code = getCode;
//     const code = getCode;
//   const post = { code:getCode};
//   console.log("POST  REQUEST => " + JSON.stringify(post) );
// console.log("PRINTING THE CODE ... " + code);
//   LogUserToBackend(post)
//   .then((resp) => {
//     // console.log(" the resp is => " + JSON.stringify(resp));
//     setauthenticated("true");
//     setuser(resp);
//     const {UserId ,usual_full_name , nickname,image_url} = resp;
//     localStorage.setItem("user",JSON.stringify(resp));
//     localStorage.setItem("authenticated", "true");
//     // const myNickname = JSON.stringify(nickname);

//     console.log("LOGGIN IN ...UseEffect Login.tsx : " + UserId + "   " + usual_full_name + " " + image_url + " " + nickname);
//     if(nickname  )
//     {
//     console.log("Existing nickname Redirecting to Account directly ..." + nickname);
//     navigateAccount();
//     }
//     else
//     {
//     navigate('/Account_infos')
//     console.log(" No Existing nickname Redirecting to Account Infos " );

      
//     }
//   })
// }
// else {
//   console.log("No code ! ");
// }

//       // console.log(value);
// // fetch('/api/authentification/oauth2/School42',
// // {
// // method: "POST",
// // body :JSON.stringify({code:code})
// // })
// // .then (response => {
// //   if(response.ok)
// //   {
// //   console.log("RESPONSE  OK => ",response)
// //     return response.json;
// //   }
// //   console.log("RESPONSE => ",response)
// // })
// }
// catch (e)
// {
//   alert(e)
// }
// },[ new URLSearchParams(window.location.search).get("code")])
  
 // const client = oauth2::Client.new(UID,SECRET,site:"https://api.intra.42.fr");
  const [user, setuser] = useState<any>("");
  const [error,SetError] = useState("");
  const users = [{ usual_full_name: "narjdal", password: "testpassword" ,nickname: "",id:1,UserId:50123,image_url:"/images/narjdal.jpeg"}];
const HandleTempoLogin = () => {

  const authenticated = localStorage.getItem("authenticated");
      const account = users.find((user) => user.usual_full_name === "narjdal");
      if (account && account.password === "testpassword") {
          setauthenticated("true")
          setuser(account);
          //We use We use JSON.stringify() to convert a JSON object to JSON text stored in a string, which can then be transmitted to the web server.
  
        //https://www.freecodecamp.org/news/how-to-use-localstorage-with-react-hooks-to-set-and-get-items/
          localStorage.setItem("user",JSON.stringify(account));
          localStorage.setItem("authenticated", "true");
          console.log("LOGGIN IN .... LOGIN.JS" + account.usual_full_name + "   " + account.password + account.nickname);
          if(account.nickname)
          navigate("/Account");
          else
          navigate("/Account_infos");
  
      }
    // };
}
  //   const handleSubmit = (e) => {
//     e.preventDefault()
//     //Oauth2//

//     navigate42();
//     // const UID = "8d53476d0b35503b5132e8298c0c72b3b9a338afc65ab471d6a11eaefdf2437a";
//     // const SECRET = "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";
//     // const Client = {
//     //   method:'POST',
//     //   headers: { 'Content-Type': 'application/json'},
//     //   body: JSON.stringify({ client_id:UID,redirect_uri:"localhost:3000/",state:"teststate",response_type:"code"})
//     // }
  
//   // fetch('https://api.intra.42.fr/oauth/authorize?client_id=8d53476d0b35503b5132e8298c0c72b3b9a338afc65ab471d6a11eaefdf2437a&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2FAccount&response_type=code')
//   //   .then( async response =>{
//   //     const data = await response.json();
//   //     if(!response.ok)
//   //     {
//   //       const error = (data && data.message) || response.statusText;
//   //       return Promise.reject(error);
//   //     }
//   //   SetUser42(data);
//   //   })
//   //   .catch(error => {
//   //     SetError("error");
//   //     console.error("There was an error !")
//   //   }) 
//     console.log(User42);

//  //------------------------------------//
    
//     const authenticated = localStorage.getItem("authenticated");
//     const account = users.find((user) => user.username === "Jane");
//     if (account && account.password === "testpassword") {
//         setauthenticated("true")
//         setuser(account);
//         //We use We use JSON.stringify() to convert a JSON object to JSON text stored in a string, which can then be transmitted to the web server.

//       //https://www.freecodecamp.org/news/how-to-use-localstorage-with-react-hooks-to-set-and-get-items/
//         localStorage.setItem("user",JSON.stringify(account));
//         localStorage.setItem("authenticated", "true");
//         console.log("LOGGIN IN .... LOGIN.JS" + account.username + "   " + account.password + account.pseudo);
//         // if(account.pseudo)
//         // navigate("/Account");
//         // else
//         // navigate("/Account_infos");

//     }
//   };
  return (
    <div className='body'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  
       <div className="login-card">
      {/* <h3>Login Using 42  </h3> */}
      {/* <button  type="button" onClick={HandleRef} > Login 42</button> */}
      {/* <button onClick={(e) => setWantsLogin(true)}> BB</button> */}
     <a href ="http://localhost:5000/auth/signup" onClick={(e) => setWantsLogin(true)}>
      <span>
      Login
        </span> 
      {/* <button href={"https://localhost/api/authentication/oauth2/school42"}
          className="px-4 bg-gray-400 whitespace-nowrap hover:bg-gray-500"
        > </button> */}
        </a>
      {/* <button  type="submit" onClick={HandleTempoLogin}> Login Dummy Account</button> */}
      </div>
    </div>
  )
};

export default Login;