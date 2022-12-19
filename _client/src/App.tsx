import './App.css';
import Navbar from './components/NavBar';
// import TempoNavbar from './components/TempoNav/NavbarGame';
import Login from './components/login/login';
import React, { useEffect } from 'react';
// import { Notification } from 'react-notifications'
// import {addNotification} from 'react-notifications';
// import { iNotification } from 'react-notifications-component'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/HomePage';
import Pong from './components/pages/Pong';
import LeaderBoard from './components/pages/LeaderBoard';
import Account from './components/Account/Account';
import AboutUs from './components/pages/AboutUs';
import HowToPlay from './components/pages/HowToPlay';
import { Landing } from './components/Chatrooms/Landing';
import { ChatRoom } from './components/Chatrooms/ChatRoom';
import Friendprofile from './components/Friendlist/Friendprofile';
import Pseudo from './components/Account/Account_infos';
import CreateRoom from './components/Chatrooms/CreateRoom';
import Carreer from './components/Account/Account_pages/Carreer';
import Achievements from './components/Account/Account_pages/Achievements/Achievements'
import './AppStyle.css'
import Social from './components/Account/Account_pages/Social/Social'
import getProfile from './utils/fetchProfile'
import { useState } from 'react';
import QRcode from './components/QRCode';
import axios from 'axios';
import QRCode from 'qrcode.react'
import { io } from "socket.io-client";
import SpectateGame from './components/GamePages/SpectateGame';
import GameLanding from './components/Game/GameLanding';
var socket:any;

const App = () => {
  const [isLogged, setIslogged] = useState(false);
  const [trylogin, settrylogin] = useState(false);
  const [done, setDone] = useState(false);

  const [twofa, setTwoFa] = useState(false);
  const [QRcodeText, setQRCodeText] = useState("");
  const [twoFAcode, setTwoFAcode] = useState("");

  const [errorMessage, setErrorMessage] = useState("");



  useEffect(() => {
    
    if (localStorage.getItem("authenticated") === "true")
     {

      //config socket client on front end
 


      console.log("Loggin the user");
      setIslogged(true);
    }
    if (localStorage.getItem("trylogin") === "true") {
      console.log("trylogin is  true");

      if(window.location.href === "http://localhost:3000/verify")
      {
        setTwoFa(true);
      }
      else
      {
      HandleProfile();
      }
    }
  
  // if(window.location.url == "")
  }, [trylogin])


  async function HandleProfile() {

    console.log("INSIDE HANDLE PROFILE");
    await getProfile()
      .then(() => {
        // console.log("Handle Profile response is => " + response)
        settrylogin(!trylogin);
      })


  }

  useEffect(() => {

    if(twofa)
    {
      console.log("Enable TWO FA && generate QR CODE ")
      GetTwoFa();
        //  generateQRCode("sometext")
    }
  },[twofa])


  const generateQRCode = (text:string) => {
    setQRCodeText(text);
  }
async function verifyTwoFa ()
{
 let  text = ("http://localhost:5000/auth/2fa/verify");
 console.log("/2fa/verify Link :  =>  " + text);

  // console.log("creating this room : "  + roomState + " Name : " + RoomName + " Password : " + password + " Owner : " + Current_User.nickname);
        await fetch(text,{
          // mode:'no-cors',
          method:'post',
          credentials:"include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
              { 
            // roomState: roomState,
            // name: RoomName,
            code: twoFAcode,}
              )
      })
      
      .then((response) => response.json())
      .then(json => {
          console.log("The 2fa/verify resp  is => " + JSON.stringify(json))

        // navigate('/Landing')
        // window.location.reload();
        if(json.statusCode == "401")
        {
          setErrorMessage("An Error occured ! Are you sure this is the correct code ? ")
        }
        else if (json.statusCode == "404")
        {
          console.log(" HELLO ITS ME ")
          setErrorMessage(json.message)
        }
        else
        {
          HandleProfile();
          setTwoFa(false);
          window.location.href = "http://localhost:3000/"
        }
          return json;
      })
      .catch((error) => {
          console.log("An error occured in 2fa/verify  : " + error)
          return error;
      })
    
        }

  const SendtwoFaCode = (e) => {
    e.preventDefault();
    console.log("SENDING THE CODE ")
    if(twoFAcode)
    {
      verifyTwoFa();
    }
    else
    {
      setErrorMessage("Code can't be empty !")
    }
  }
async function GetTwoFa () {

  const text = "http://localhost:5000/auth/2fa/QrCode" ;
  console.log("/2fa/QrCode Link :  =>  " + text);

  await axios.get(text,
    {withCredentials:true}
  )

.then(json => {
  console.log("The /2fa/QrCode esp : " + JSON.stringify(json.data));
  generateQRCode(json.data.otpauth_url)
  setDone(true);
})
.catch((error) => {
  setErrorMessage("An error occured ! Cannot display the QR CODE .")
    console.log("An error occured  while fetching the /2fa/enable  : " + error)
    return error;
})

}


useEffect(() => {
  
  if(isLogged)
  {
    socket = io("http://localhost:5000");
    // console.log("Hadik hya:",localStorage.getItem("user"));

    socket.emit("onlineUsersBack", 
    { 
      user: JSON.parse(localStorage.getItem("user")!) 
     });
    
    console.log("socket is connecting ", socket);
      socket.on("onlineUsersFront", (data: any) => {
      console.log("OnLine e e e e e: ", data);
      localStorage.setItem("online",JSON.stringify(data))
    });
                // onlineUsersFront

  }
  return () => {
    // localStorage.setItem("online","");
  }

},[isLogged])

  if(twofa)
  {
    return (
      <>
      <div className='QR-card'>
        
        {done ? (
          <>
            <QRCode
        id="qrCodeEl"
        size={150}
        value={QRcodeText}
      />
      <br/>

        <input
          type="text"
          placeholder="Enter Two FA Password"
          value={twoFAcode}
          onChange={e => setTwoFAcode(e.target.value)}
        />
      <br/>

        <button onClick={SendtwoFaCode} >
          ENTER
        </button>
          </>
        ) : (
          <>
          
          </>
        )}
                {errorMessage && <div className="error"> {errorMessage} </div>}

    
        </div>
      </>
    )
  }
  if (!isLogged) {
    console.log("You are not logged in.");
    return (
      <>
        <Router>
          <button onClick={(e) => localStorage.setItem("trylogin", "true")}> <Login />
          </button>

        </Router>
      </>
    )
  }
  else {
    return (
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Account />} />
            <Route path='/Pong' element={<Pong />} />
            <Route path='/LeaderBoard' element={<LeaderBoard />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Account_infos' element={<Pseudo />} />
            <Route path='/AboutUs' element={<AboutUs />} />
            <Route path='/HowToPlay' element={<HowToPlay />} />
            <Route path="/Landing" element={<Landing />} />
            <Route path="/room/:id" element={<ChatRoom />} />
            <Route path="/SpectateGame/:id" element={<SpectateGame />} />
            <Route path="/GameLanding" element={<GameLanding />} />


            <Route path="/Carreer/:id" element={<Carreer />} />

            <Route path="/CreateRoom" element={<CreateRoom />} />
            <Route path="/users/:nickname" element={<Friendprofile />} />
            <Route path="/Achievements" element={<Achievements />} />
            <Route path="/Social" element={<Social />} />
            <Route path="/verify" element={<QRcode />} />



          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
