import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import ProfilePicUpload from '../Account/ProfilePicUpload';
import UpdateNickname from '../Account/UpdateNickname';
import './Account.css'
import { Link } from 'react-router-dom';
import Login from '../login/login';
import DisplayAchievementsList from './Account_pages/Achievements/DisplayAchievementsList';
import DisplayMatchHistory from './Account_pages/DisplayMatchHistory';

import axios from 'axios';
const Account = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
    const [Updated, setisUpdated] = useState(false);
	 const [user42,SetUser42] = useState <any>([]);
  const [showradiotwofa,Setradiotwofa] = useState(false);
  const [twoFa,setTwoFa] = useState(false);
  const [TwoFaDisable,setTwoFaDisable] = useState(false);
  const [TwoFaEnable,setTwoFaEnable] = useState(false);
  const [msg, setMsg] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [TwoFaMessage, setTwoFaMessage] = useState("");


const [AchievementsList,setAchievementsList] = useState<any>([])
const [minihistory,setMiniHistory] = useState<any>([])

  useEffect(() => {

    const authenticated = localStorage.getItem("authenticated");
  const loggeduser = localStorage.getItem("user");

    if(loggeduser)
    {

      var Current_User = JSON.parse(loggeduser);
      // console.log("=>>>>> FROM THE ACCOUNT " + loggeduser   + Current_User.nickname + Current_User.UserId)
      if(Current_User.tfa)
      {
        setTwoFaMessage("Two Factor Authentification is activated !")
        setTwoFaDisable(true);
        setMsg("Disable two FA.");
        setTwoFaEnable(false);

      }
      else
      {
        setTwoFaMessage("Two Factor Authentification is not activated !")
        setMsg("Activate two FA.");
        setTwoFaEnable(true);
        setTwoFaDisable(false);
        // setTwoFa(true);
      }
      SetUser42(Current_User);
    
    
      const achievementss = [
        {AchievementsId:0,name:"First try",description:"Play your first game ",image_url:"images/1000_F_224798026_pByZntuv55dc3gxv1KArR6ReyognIyJx.jpeg",unlock:true},
        {AchievementsId:1,name:"Payback",description:"Win a game against a player that you lost again ",image_url:"images/reaper-icon-icon-white-background-reaper-icon-graphic-web-design-reaper-icon-icon-white-background-reaper-icon-176386733.jpeg",unlock:false},
        {AchievementsId:2,name:"Alpha",description:"Be the Top 1 player of the leaderboard",image_url:"images/reaper-icon-icon-white-background-reaper-icon-graphic-web-design-reaper-icon-icon-white-background-reaper-icon-176386733.jpeg",unlock:true},
    ];
    
    const minihisto = [
      {MatchId:0,userId:50213,nickname:"narjdal",image_url:Current_User.avatar,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"10-8",winner:true},
      {MatchId:1,userId:50213,nickname:"narjdal",image_url:Current_User.avatar,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"12-8",winner:true},
      {MatchId:2,userId:50213,nickname:"narjdal",image_url:Current_User.avatar,P2UserId:50229,P2nickname:"test56",P2image_url:"/images/AccountDefault.png",finalScore:"2-3",winner:false},
    
    ];
    setMiniHistory(minihisto);
    setAchievementsList(achievementss);
      
    }

    
    // console.log("I am navigating =>>> ");
    // navigate('/Account');
    //  const {UserId,usual_full_name} = user42;

    },[]);

  
  
    const HandeAchievements = (e) => {

      e.preventDefault();
      console.log("From Handle Achievements  ")
        navigate('/Achievements')
    };

    const HandleMatchHistory = (e) => {
    e.preventDefault();
    console.log("From Carreeeer ")
      navigate('/Carreer')
    }

     const handleFriendClick = (e) => {
      e.preventDefault()
      console.log("From Friend Click");
      navigate("/Social");
      
     }
     const HandleTwoFactor = () => {
        // if(!showradiotwofa)
      // {
      //   setErrorMessage("An Error occured");
      // }
      Setradiotwofa(!showradiotwofa);
      
    
      // Here Request to GET Two FA if enable or not Ou je lai deja
    }
    const HandleTwoFa = () => {
      // Setradiotwofa(!showradiotwofa);
      // Here Request to GET Two FA if enable or not Ou je lai deja
      setTwoFa(!twoFa);
      setTwoFaDisable(false);
    }

    const DisableTwoFa = () => {
      // Setradiotwofa(!showradiotwofa);
      // Here Request to GET Two FA if enable or not Ou je lai deja
      setTwoFaDisable(!TwoFaDisable);
      setTwoFa(false);
    }
async function EnableTwoFa () {


  
  

  const text = "http://localhost:5000/player/2fa/enable/" ;
  console.log("/2fa/enable Link :  =>  " + text);
  let loggedUser = localStorage.getItem("user");
  if(loggedUser)
  {
  var current = JSON.parse(loggedUser);

  

  await axios.get(text,{withCredentials:true}
    // mode:'no-cors',
    // method:'get',
    // credentials:"include"
  )

// .then((response) => response.json())
.then(json => {
    // json.data.id = params.id;
  console.log("The /2fa/enable esp : " + JSON.stringify(json.data));
  if (json.data.statusCode == "404")
  {

  }
  const current = JSON.parse(localStorage.getItem("user")!);
  const NewUser = [
    {
      id:current.id,
      nickname:current.nickname,
      avatar:current.avatar,
      firstName:current.firstName,
      lastName:current.lastName,
      email:current.email,
      wins:current.wins,
      loses:current.loses,
      tfa:true,
      tfaSecret:current.tfaSecret
    }
  ]
  console.log("USER : " + JSON.stringify(NewUser[0]))
localStorage.setItem("user",JSON.stringify(NewUser[0]));
window.location.reload();

// localStorage.setItem("user","");
// localStorage.setItem("user",JSON.stringify(NewUser));

  // setQRCodeText(json.data);
  // setDone(true);
  // if(json.data == "dm")
//   // {
//     const room ={
//       ...json.data.room,
//       id:params.id
//     }
//     setRoom(room);
//     setAllgood(true);
//     // GetPermissions();
//     // GetPermissions();
//     console.log("This is a DM Room");
//     if(json.data.room.all_members)
//   {

//   if(current.id == json.data.room.all_members[0].player.id)
//   {
//     setRoomName(json.data.room.all_members[1].player.nickname);
//   }
//   else
//   {
//     setRoomName(json.data.room.all_members[0].player.nickname);
//   }
// }
//     // setRoomName(json.data.room.name)
//     setIsDm(true);
//     console.log(" THIS IS A DM GETTYPEOF ROOM");
  //   setAllgood(true)
  //   // localStorage.setItem("isdm","true");
  //   setIsDm(true);
  //   // console.log("the name should be : " )
  // }
   
})
.catch((error) => {
  setErrorMessage("An error occured ! .");

    console.log("An error occured  while fetching the /2fa/enable  : " + error)
    return error;
})
}
}


async function SendDisableTwoFa () {


  
  

  const text = "http://localhost:5000/player/2fa/disable/" ;
  console.log("/2fa/disable Link :  =>  " + text);
  let loggedUser = localStorage.getItem("user");
  if(loggedUser)
  {
  var current = JSON.parse(loggedUser);

  

  await axios.get(text,{withCredentials:true}
    // mode:'no-cors',
    // method:'get',
    // credentials:"include"
  )

// .then((response) => response.json())
.then(json => {
    // json.data.id = params.id;
  console.log("The /2fa/disable esp : " + JSON.stringify(json.data));

  const current = JSON.parse(localStorage.getItem("user")!);
  const NewUser = [
    {
      id:current.id,
      nickname:current.nickname,
      avatar:current.avatar,
      firstName:current.firstName,
      lastName:current.lastName,
      email:current.email,
      wins:current.wins,
      loses:current.loses,
      tfa:false,
      tfaSecret:current.tfaSecret
    }
  ]
  console.log("USER : " + JSON.stringify(NewUser[0]))
localStorage.setItem("user",JSON.stringify(NewUser[0]));
window.location.reload();

   
})
.catch((error) => {
  setErrorMessage("An error occured ! .");

    console.log("An error occured  while fetching the /2fa/disable  : " + error)
    return error;
})
  }
}

    const SendTwoFa = (e) => {
      e.preventDefault();
      // Setradiotwofa(!showradiotwofa);
      // Here Post Request  Of Two FA 
      //if enable or not Ou je lai deja
      if(twoFa)
      {
        // setErrorMessage("POSTIF CHEF ENABLING")
        setIsUpdating(true);
        EnableTwoFa();

        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
        }, 2000);
        console.log("POSITIF CHEF")
      }
      else
      {
        // setErrorMessage("NEGATIF CHEF DISABLE")
        setIsUpdating(true);
        SendDisableTwoFa();
        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
        }, 2000);
        console.log("NEGATIF CHEF")
      }
    // if(twoFa)
    // {
    //   console.log("Enabling two fa in your account ....");
    // }
    // else
    // {
    //   console.log("Disabling two fa in your account ...")
    // }
    }

    //ProfilePicUpload : Send User infos here  Get from state ?
    return (
      <div>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
<>

<div className='body'>
      <div className='Account-card'>
		  <img className="avatar" src={user42.avatar} alt="avatar" />
        Welcome to your Dashboard  {user42.nickname} ! 
        <br/>
      <button type="button" className='has-border' onClick={HandleTwoFactor}>  
      <span className="icon material-symbols-outlined">
     {"Lock"}  2FA      </span> 
      </button>
      {showradiotwofa ? (
          <>
                {TwoFaMessage && <div className="error"> {TwoFaMessage} </div>}
		<form className='AccountTwoFa-form'>
        {TwoFaEnable ? (
          <>
     <input type="radio"
        value ="Enable"
       placeholder="Room Name " 
       checked = {twoFa}
       onChange={HandleTwoFa}
       />
       Enable
       
       {twoFa ? (
        <>
               <button
			   type="submit"
      onClick={SendTwoFa}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "Priority" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : msg}
      </span>
    </button>

{/* {done ? (
  <>
      <QRCode
        id="qrCodeEl"
        size={150}
        value={QRcodeText}
      />
  </>
) : (
  <>
  </>
)} */}

        </>
       ) : (
        <>
        </>
       )}
          </>
        ) : (
          <>
   
       <input type="radio"
        value ="Disable"
       placeholder="Room Name " 
       checked = {TwoFaDisable}
       onChange={DisableTwoFa}
       />
       Disable

{TwoFaDisable ? (
  <>
  <button
			   type="submit"
      onClick={SendTwoFa}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "Priority" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : msg}
      </span>
    </button>
  </>
) : (
  <>
  </>
)}
       
          </>
        )}
    
 

      
                {errorMessage && <div className="error"> {errorMessage} </div>}
        </form>
          </>
      ) : (
          <>
          </>
        )}
        <div className='AccountButtons'>
      <button type="button" className='' onClick={handleFriendClick}>  
         <span className="icon material-symbols-outlined">
     {"People"}  Social
      </span>
      </button>
 

      </div>
        <UpdateNickname
        />
      <ProfilePicUpload
      ProfileInfo={{name:user42.nickname,ProfilePic:user42.image_url}}/>
          </div>
          <br/>
          <div className='intra-card'>
          <div className='last-Achievements-card'>
          <button type="button" className='has-border' onClick={HandeAchievements}>  
      <span className="icon material-symbols-outlined">
     {"military_tech"}  
      </span> 
      <span>See All Achievements</span>
      </button>
      <span>{AchievementsList.map(c => < DisplayAchievementsList  key = {c.AchievementsId} AchievementsList ={c} />)}</span>
            </div>
            <div className='LastMatch-card'>
            <button type="button" className='' >  
      <span className="icon material-symbols-outlined">
     {"History"}  
      </span> 
      <Link style={{color:'blue'}} to={`/Carreer/${user42.nickname}`} >
   <span> See All </span>
    </Link>
      </button>
      <span>{minihistory.map(c => < DisplayMatchHistory  key = {c.MatchId} match ={c} />)}</span>

            </div>
          </div>
          </div>
</>
      </div>
    );
    }
  
export default Account;
