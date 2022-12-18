import React, { useEffect } from 'react';
import person from '../users/users.json'
import { Link, useParams } from 'react-router-dom';
import { useState } from "react";
import './Friendprofile.css'
import { Location } from 'react-router-dom';
import { IsAuthOk } from '../../utils/utils';
import axios from 'axios';

const Friendprofile = () => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [userState, setUserState] = useState<any>([]);
  const [relation, setRelation] = useState("");
  const [isMe,setIsMe] = useState(false);
  const [allgood,setAllGood] = useState(false);

  const [icons, setIcons] = useState("");
  const [msg, setMsg] = useState("");
  const [action, setAction] = useState("");
  const [choice, setChoice] = useState("");
  localStorage.setItem("choice", "");
  localStorage.setItem("action2", "");
  //We send the Id as the params of the Link , 
  //ICi request Au Backend Avec l'ID de l'user demander stocker les infos dans const user 

  async function AcceptRelationship() {

    let endpoint = "http://localhost:5000/player/acceptFriendship/"

    console.log("AcceptRelationship  => " + endpoint + " \n user:" + params.nickname)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response  => " + JSON.stringify(json))
          IsAuthOk(json)
          window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't Accept Relationship    ! ");
        return error;
      })

  }


async function BlockRelationship()
{
   let endpoint = "http://localhost:5000/player/blockFriendship/"


    console.log("BlockRelation  => " + endpoint + " \n user" + params.nickname)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        // if (json.ok)
        // IsAuthOk(json);
        // window.location.reload();
        if(json.statusCode == "404")
        {
          setErrorMessage(json.message)
        }
        else
        {
        setErrorMessage("");
          window.location.reload();
        }
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't Refuse Relationship    ! ");
        return error;
      })
}

  async function RefuseRelationship() {


    let endpoint = "http://localhost:5000/player/refuseFriendship/"

    console.log("RefuseRelationship  => " + endpoint + " \n user" + params.nickname)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        // if (json.ok)
        IsAuthOk(json);
          window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't Refuse Relationship    ! ");
        return error;
      })

  }

  async function ExecuteRelationship() {
    let endpoint;
    let execute = localStorage.getItem("action2");
    console.log("Execute final " + action);
    switch (action) {
      case "addFriend":
        {
          endpoint = "http://localhost:5000/player/requestFriendship/"
          break;
        }
      case "blockFriend":
        {
          endpoint = "http://localhost:5000/player/blockFriendship/"
          break;

        }
      case "Accept":
        {
          endpoint = "http://localhost:5000/player/acceptFriendship/"
          break;

        }
      case "Refuse":
        {
          endpoint = "http://localhost:5000/player/refuseFriendship/"
          break;

        }
      case "unblockFriend":
        {
          endpoint = "http://localhost:5000/player/unblockFriendship/";
          break;
        }

    }
    // console.log("ExecuteRelationship  => " + endpoint + " \n action" + execute)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        IsAuthOk(json);
        // if (json.ok)
        window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't update Relationship    ! ");
        return error;
      })

  }


  async function FetchRelationship() {

    const loggeduser = localStorage.getItem("user");
    if (loggeduser) {
      const current = JSON.parse(loggeduser);
      console.log("Fetching Relationship    Infos   => " + params.nickname + " I am : " + current.nickname);

      let endpoint = 'http://localhost:5000/player/statusFriendship/'
      let nicknametofetch: string = JSON.stringify(params.nickname);
      // console.log(" this endpoint   " + endpoint + " Fetching : " + nicknametofetch)
      http://localhost:5000/statusFriendship/?id=narjdal

      await fetch((`http://localhost:5000/player/statusFriendship/${params.nickname}`
      ), {
        // mode:'no-cors',
        method: 'get',
        credentials: "include"
      })



        .then((response) => response.json())
        .then(json => {
          console.log("The Status Response is => " + JSON.stringify(json))
          // setErrorMessage("");
          if(json.statusCode == "404")
          {
          setErrorMessage(json.message);

          }
          // localStorage.setItem("usertoshow",JSON.stringify(json));
          localStorage.setItem("choice", json);
          // setRelation(json);
          // setChoice(json);
          return json;
          // setRelation("AcceptOrRefuse");
          //  if(json)
          //  {
          //  console.log("The Relationship is => " + json)
          //   setRelation(JSON.stringify(json));
          //   setChoice(json);
          //   setRelation(json);
          //  }

          //     if (resp === "AddFriend")
          //     {
          //       console.log("GGS");
          //     }
          //     switch(JSON.stringify(json))
          //  {
          //   case "AddFriend":
          //    {
          //     console.log("ww khello")
          //     setIcons("people")
          //    setMsg("AddFriend");
          //    setAction("Add");
          //    setRelation("addFriend");
          //    break;
          //    }  

          //   case "blockFriend":

          //   {  
          //     setIcons("block")
          //    setMsg("block");
          //    setAction("block")
          //      setRelation("blockFriend");
          //    break;

          //   }

          //      case"unblockFriend":

          //     {
          //    setMsg("unblock");
          //       setAction("unblock")
          //     setIcons("unblock")

          //        setRelation("unblockFriend");
          //    break;

          //     }
          //     case "pendingFriend":
          //      { 
          //     setIcons("people")
          //     setMsg("pending ...")
          //     setAction("pending")
          //      setRelation("pendingFriend")
          //    break;

          //     }
          //     case"acceptFriend":
          //     {
          //   //  setMsg("Accept");
          //     // setIcons("people")
          //     // setAction("");
          //        setRelation("AcceptOrRefuse");
          //    break;

          //     }
          //   default:

          //    {
          //     console.log("ERROR DEFAULT" + json) 
          //     setRelation("error");
          //    break;
          //   }
          //    }
        })
        .catch((error) => {
          console.log("An error occured : " + error)
          // setRelation("error");
          setErrorMessage("An error occured! Relationship not found ! ");
          return error;
        })

    }

  }
  async function FetchUserInfos() {
    // console.log("Fetching User Profile  Infos  Home Page  => " + params.nickname);


    const loggeduser = localStorage.getItem("user");
    if (loggeduser) {
      let endpoint = 'http://localhost:5000/player/profile/?id=';
      console.log(" this endpoint   " + endpoint)
      await fetch((`http://localhost:5000/player/profile/${params.nickname}`), {
        // mode:'no-cors',
        method: 'get',
        credentials: "include"
      })


        .then((response) => response.json())
        .then(json => {
          console.log("The User  is => " + JSON.stringify(json))
          // setErrorMessage("");
          // localStorage.setItem("usertoshow",JSON.stringify(json));
          if(json.statusCode == "404")
          {
            setAllGood(false);
            setErrorMessage(json.message)
          }
          else
          {
            setAllGood(true);
          }
          setUserState(json);
          return json;
        })
        .catch((error) => {
          console.log("An error occured : " + error)
          setUserState([])
          // localStorage.setItem("usertoshow","");
          setErrorMessage("An error occured! User not found ! ");
          return error;
        })

    }

  };

  async function SetRelationInfos() {


    await FetchRelationship()
      .then(() => {
      })
    const tt = localStorage.getItem("choice");
    if (tt === "addFriend") {
      // console.log("ww khello")
      setIcons("people")
      setMsg("AddFriend");
      setAction("addFriend");
      setRelation("addFriend");
      //  ExecuteRelationship("AddFriend");
      localStorage.setItem("action", "addFriend");

    }
    if (tt === "blockFriend") {
      setIcons("block")
      setMsg("Block friend ");
      setAction("blockFriend")
      setRelation("blockFriend");
      localStorage.setItem("action", "blockFriend");

      //  ExecuteRelationship("BlockFriend");
    }
    if (tt === "unblockFriend") {
      setMsg("Unblock this user.");
      setAction("unblockFriend")
      setIcons("block")
      setRelation("unblockFriend");
      localStorage.setItem("action", "unblockFriend");

      //  ExecuteRelationship("Unblock");

    }
    if (tt === "pendingFriend") {
      setMsg("Waiting for the user to accept ...");
      setAction("pending")
      setIcons("hourglass_top")
      setRelation("pending");
      localStorage.setItem("action", "pending");

    }
    if (tt === "acceptFriend" || tt === "refuseFriend") {
      setRelation("AcceptOrRefuse");
    }
    if (tt === "YourBlocked") {
      setAction("none");
      setRelation("YourBlocked");
      localStorage.setItem("action", "none");
    }
    else {
      const arr = (localStorage.getItem("choice")!)

      if (arr.includes("acceptFriend") || arr.includes("refuseFriend")) {
        setRelation("AcceptOrRefuse");
      }
      // setMsg("An error o");
      // setAction("noaction");
      // setRelation("error");
      // localStorage.setItem("action","noaction");

    }
    console.log("TT is " + tt + " the action is " + action);

    // if(localStorage.getItem("choice"))
  };
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if(loggedUser)
    {
      const current = JSON.parse(loggedUser);
      if(current.nickname == params.nickname)
      {
        setIsMe(true);
      }
    }
    FetchUserInfos();

    SetRelationInfos();
    // FetchUserInfos();

    
    // ExecuteRelationship();
  }, [])

  useEffect(() => {
    
    let onlineUsers = localStorage.getItem("online");
    if(userState)
    {

    if(onlineUsers)
    {
        let ParsedUsers = JSON.parse(onlineUsers);
        console.log ( "PARSED USER : " , ParsedUsers);

    let srch = ParsedUsers.filter((m: any) => {
    console.log(" ME id : " + userState.id + "  ME NICKNAME : " + userState.nickname  +  " : " , ParsedUsers);
    return m.id === userState.id
  })[0]

    if(srch)
    {
        console.log(" THIS USER IS LOGEED IN  " + JSON.stringify(srch))
        // setImLogged(true);
    }
    else if (!srch)
    {
        console.log( " THIS USER NOT LOGGED IN ");
        // setImLogged(false);
    }
        // const isInsideLoggedUsers = ParsedUsers.filter(s => s.id);
    }
  }

  },[userState])

  const HandleAction = (e) => {
    e.preventDefault();

    // const execute = localStorage.getItem("action")
    console.log("Executing this command =>   " + action);
    if (action !== "error")
      ExecuteRelationship();
    else
      console.log("Error ! can't execute action.");

  }

  const HandleRefuseFriendRequest = (e) => {
    e.preventDefault();
    setAction("Refuse");
    // localStorage.setItem("action","Refuse");
    // ExecuteRelationship();
    RefuseRelationship();
  }

  const HandleAcceptFriendRequest = (e) => {
    e.preventDefault();
    console.log("Accepting the request ...");
    setAction("Accept")
    AcceptRelationship();

  }
  const HandleInviteToGame = (e) => {
    e.preventDefault();
    console.log("invinting to play a game ...")
  }



  async function FetchRoomId()
  {
    const text = "http://localhost:5000/player/sendMessageButton/" + params.nickname;
    console.log("Api  Sendmessagebutton  Link :  =>  " + text);
    

    await axios.get(text,{
      withCredentials:true
      // mode:'no-cors',
      // method:'get',
      // credentials:"include"
  })
  
  // .then((response) => response.json())
  .then(json => {
      // json.data.id = params.id;
      // console.log("json" + json)
      console.log("The response Of SendMessage  is  => " + JSON.stringify(json.data))
      // SetUserAdmin(json);
      if(json.data)
      {
        window.location.href = "http://localhost:3000/room/" + json.data;

      }
     
  })
  .catch((error) => {
      console.log("An error occured  while fetching the SendMessage Id  ! : " + error)
      setErrorMessage(" An error occured while fetching the SendMessage Room id  ");
      return error;
  })

  }

  const HandleSendMessage  =  (e) => {
    e.preventDefault();
    console.log("Fetching the room id !")
    FetchRoomId();

  }

  const HandleBlockUser = (e) => {
    e.preventDefault();

    // setAction("blockFriend")
    BlockRelationship();

    // console.log("Executing this command =>   " + action);
    // if (action !== "error")
    //   // ExecuteRelationship();
    // // else
      // console.log("Error ! can't execute action.");

    // console.log("BLOCKING THIS USER ")
  }
  if (!userState) {
    // TODO: 404
    console.log("ERROR ·404  from Friend Profile ,User Not found" + params.id + params.name);
    return (
      <>
      </>
    )
  }
  else {
    // console.log("B4" + userState['nickname'] + params.nickname);
    return (
      <div className='FriendProfile'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {errorMessage && <div className="error"> {errorMessage} </div>}
  
    {allgood ? (
      <>
          <>
       <img src={userState.avatar} height="80" />
        <h2>{userState.nickname}</h2>
        <h3>TotalGames: </h3>
        <h2>{userState.wins}</h2>
        <h3>Win:</h3>
        <h2>{userState.wins}</h2>
        <h3>Lose</h3>
        <h2>{userState.loses}</h2>
          </>
          <button type="button" className='' >
                      <span className="icon material-symbols-outlined">
                        {"History"}
                      </span>
                      <Link style={{ color: 'blue' }} to={`/Carreer/${userState.nickname}`} >
                        <span>  {userState.nickname} Carreer </span>
                      </Link>
                    </button>


        <br />
        {isMe ? (
          <>
  
          </>
        ) : (
          <>
           {relation === "YourBlocked" ? (
          <>
            <button type="button" className='button-displayuser' >
              <span className="icon material-symbols-outlined">
                {"sentiment_very_dissatisfied"}
              </span>
              <span> You are blocked !    </span>
            </button>
          </>
        ) : (
          <>
            {relation === "AcceptOrRefuse" ? (
              <>
                <button type="button" className='' >
                  <span className="icon material-symbols-outlined">
                    {"History"}
                  </span>
                </button>
                <br />
                <h2>{userState.nickname} want to be your friend ! </h2>
                <button type="button" className='button-displayuser' onClick={HandleAcceptFriendRequest}>
                  <span className="icon material-symbols-outlined">
                    {"Favorite"}
                  </span>
                  <span>Accept</span>
                </button>
                <button type="button" className='button-displayuser' onClick={HandleRefuseFriendRequest}>
                  <span className="icon material-symbols-outlined">
                    {"Cancel"}
                  </span>
                  <span>Refuse</span>
                </button>

                <button type="button" className='button-displayuser' onClick={HandleBlockUser}>
                  <span className="icon material-symbols-outlined">
                    {"Block"}
                  </span>
                  <span>Block</span>
                </button>
              </>
            ) : (
              <>

                {action ? (
                  <>
                 

                  </>
                ) : (
                  <>
                 
                  </>
                )}
                {action == "addFriend" ? (
                  <>
                  <br/>
                    <button type="button" className='button-displayuser' onClick={HandleBlockUser}>
                  <span className="icon material-symbols-outlined">
                    {"block"}
                  </span>
                  <span> Block this user </span>
                </button>
                  </>
                ) : (
                  <>

                  </>
                )}
                <br />
                <button type="button" className='button-displayuser' onClick={HandleAction}>
                  <span className="icon material-symbols-outlined">
                    {icons}
                  </span>
                  <span>{msg}</span>
                </button>
                <br/>
             
                  
        
                     <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleInviteToGame}>
    <span className="icon material-symbols-outlined">
     {"stadia_controller"}  
      </span>
      <span> Play  </span>
      </button>
                  <br/>
      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleSendMessage}>
    <span className="icon material-symbols-outlined">
     {"forward_to_inbox"}  
      </span>
      <span> Send Message  </span>
      </button>
      
              </>

            )}

          </>
        )}
          </>
        )}
       

      </>
    ) : (
      <>

      </>
    )}
       
      </div>
    );
  }
}

export default Friendprofile;