import React, {useState} from 'react';
import {Link} from'react-router-dom';
import BLoggin from '../login/login';

import './NavbarGame.css'
import {useEffect} from "react";
import logout from '../logout/logout';
import LogOut from '../logout/logout';
import person from "../users/users.json"
import ContactList from '../Friendlist/ContactList';
import { useNavigate,useLocation} from 'react-router-dom';


function TempoNav() {
    const [click,setClick]= useState(false);
  const [isShown,setIsShown] = useState(false);
    const [authenticated, setauthenticated] = useState("");
    // const navigate  useNavigate();
  const [user42,SetUser42] = useState <any>([]);
    
    const loggedInUser = localStorage.getItem("authenticated");
   
    const LogUserOut = () => {
      const loggedInUser = localStorage.getItem("authenticated");
      console.log("Before  : " + loggedInUser);
      if (loggedInUser == "true")
      {   
          localStorage.setItem("authenticated", "false");
          localStorage.setItem("user","");
          setauthenticated("false");
      const loggeduser = localStorage.getItem("user");
      if(loggeduser)
      var Current_User = JSON.parse(loggeduser);
          console.log("Logging out ..." + authenticated);
          if(Current_User)
        console.log("=>>>>> FROM THE NAVBAR  LOGOUT "   + Current_User.nickname + Current_User.UserId)

          navigate("/");
          window.location.reload();
      }
  };
  
  const handleFriendClick = event => {
    // Toggle Shown state
    setIsShown(current => !current);

     };
  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
    console.log("NavBar : Is User  auth ?  " + authenticated);
  
    if (authenticated == "true") {
      setauthenticated(authenticated);
    }
    if(loggeduser && authenticated == "true")
    {
      var Current_User = JSON.parse(loggeduser);
      console.log("=>>>>> FROM THE NAVBAR "   + Current_User.nickname + Current_User.UserId)
      SetUser42(Current_User);
    }
  //  const {UserId,usual_full_name} = user42;

  }, []);

  const navigate = useNavigate();
  const navigateHome = () => {
      // 👇️ navigate to /contacts
      console.log("NAVIGATE TO HOME ");
      navigate('/');
    };
    const navigateAccount = () => {
      // 👇️ navigate to /contacts
      navigate('/Account');
    };
    const navigateChatRooms = () => {
      // 👇️ navigate to /contacts
      navigate('/Landing');
    };
    const navigateLeaderBoard = () => {
      // 👇️ navigate to /contacts
      navigate('/LeaderBoard');
    };
    const navigatePlay = () => {
      // 👇️ navigate to /contacts
      navigate('/Pong');
    };
    return (
    <nav className='TempoNav'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <div className='TempoNav-container'>
        <button type="button" onClick={navigateHome} >
                    <span className="icon material-symbols-outlined">
                Home 
      </span>
                  </button>
                  <button type="button" onClick={navigateAccount} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"manage_accounts"} 
      </span>
                  </button>
                  <button type="button" onClick={navigatePlay}>
                <span className="icon material-symbols-outlined">
     {"videogame_asset"} 
      </span>
                  </button>
        
                  <button type="button" onClick={navigateLeaderBoard} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"LeaderBoard"} 
      </span>
                  </button>
              
                  <button type="button" onClick={navigateChatRooms}>
                    <span className="icon material-symbols-outlined">
     {"Groups"}  
      </span>
                  </button>
  
                      <button type="button" className='has-border' onClick={handleFriendClick}>
                    <span className="icon material-symbols-outlined">
     {"People"}  
      </span>
      
                      </button>
                      <button type="button" onClick={LogUserOut} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      </button>
                      <img src={user42.image_url} className="avatarGame"/>
                      </div>
        {/* <button type="button" onClick={navigateHome} >
                    <span className="icon material-symbols-outlined">
                Home 
      </span>
      </button>
                  <button type="button" onClick={navigateAccount} className="has-border">
                    <img src="./images/icon-accounts.svg" />
                  </button>
                  <button type="button" onClick={navigatePlay} className="has-border">
                    <img src="./images/cbf1ba6cba8053055f09d9b77fe2b884.jpeg" />
                  </button>
        
                  <button type="button" onClick={navigateLeaderBoard} className="has-border">
                    <img src="./images/icon-acoustic.svg" />
                  </button>   
        <button type="button" onClick={navigateChatRooms} className="has-border">
                    <img src="./images/icon-levels.svg" />
                  </button>
      <button type="button" onClick={LogUserOut} className="has-border">
      <img src="./images/logout-icon-png-transparent-login-logout-icon-11562923416nzkie6fbka.png" height="25"/>
                  </button>
      <img src={user42.image_url} height="35" className='GameProfilePic'/>
    </div>
    <button type="button" className='has-border' onClick={handleFriendClick}><img src="/images/Chaticon.png" height="35"/>
                    <span> Social</span>
                      </button> */}
                     {isShown && ( 
                        
                      //Show the friendlist only if button is pressed
                      // Here : Send an array.map of the Friendlist of the user 
                      // get request to backend , JSON object -> parse 
                      <div className='Contact'>
                        <span>
                        
                        <ContactList contacts={person} />
                        </span>
                      </div>
                     )}
      <div className='TempoBody'>
    <button type="button" className="TempoBurger" >
    </button>
  </div>
    </nav>
    
    
    )
}

export default TempoNav