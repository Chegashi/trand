import React, { useMemo } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState,useEffect } from "react";
import person from '../users/users.json'
import './ChatRoomBox.css'
import MessageList from '../DirectMsg/MessageList';
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import axios from 'axios';
import { IsAuthOk } from '../../utils/utils';
import { set } from 'date-fns';
import { io } from "socket.io-client";
import { Socket } from 'dgram';
import { any } from 'prop-types';

var socket:any;

//https://codeburst.io/tutorial-how-to-build-a-chat-app-with-react-native-and-backend-9b24d01ea62a
const ChatRoomBox = (props,statusMember) => {

  const navigate = useNavigate();
  const [inputMsg,SetInputMsg] = useState("");
  const [BanUser,SetBanUser] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [ifBlocked, setIfBlocked] = useState(false);

  const [Updated, setisUpdated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
  
  const[members,setMembers] = useState <any >([]);
const [allMembers,setAllMembers] = useState <any>([]);


  const [messages, setMessages] = useState <any>([]);
  const [showInput,setShowInput] = useState(false)
  const [userQuery,setUserQuery] = useState("");
  const [allgood,setAllgood] = useState(false);


  
  const HandleInputMsg = (e) => {
    e.preventDefault();
    SetInputMsg(e.target[0].value);

    // console.log("INPUT MSG => ",inputMsg);
    // if (inputMsg)
    // {
    //   //Post request to Backend
    // }
  }
  
  // const HandleBanUser = (e) => {
  //   e.preventDefault();
  //   SetBanUser(e.target[0].value);
  // }


//   async function FetchUserInfo (id) {

//     // ]
//   const loggeduser = localStorage.getItem("user");

//   if(loggeduser)
// {
//   var Current_User = JSON.parse(loggeduser);
//   const text = ("http://localhost:9000/GetUserPicture");
//   console.log("Api get Link :  =>  " + text);
  
//   const response = await axios.get("http://localhost:9000/GetUserPicture",{
//   headers: {
//     userId:id
//   }
//   }
//   )
//   const {nickname ,UserId,image_url,id42} = response.data;
//   console.log("The Friends are " + JSON.stringify(response.data));
// //   response.data.forEach( result => {
// //     // console.log(result.data.name);
// //     console.log(result.data.id);
// //     console.log(result.data.image_url);
// //     console.log(result.data.id42);

// // })
//     // console.log(" Nickname " + response.data[0].name + " IU => " + response.data[0].image_url  + " |id42 " + response.data[0].id42);
//   // 	onUploadProgress: progressEvent => {
//   // 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
//   // 	},
//   // });
  
//   // 	}
//     return response.data;
// }

//   }

async function GetMembers () 
{

  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/listOfMembers/" + props.room.id;
    // console.log("Api Fetch Link :  =>  " + text);
try
{

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      // console.log(" Members Of ChatRoom  :   => " + JSON.stringify(json))
      if(IsAuthOk(json.statusCode) == 1)
      window.location.reload();

      if(json.statusCode == "500" )
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
         
        }
        else
        {
          setAllgood(true);
          if(!json.nickname)
          {
            localStorage.setItem("members",JSON.stringify(Current_User));
          }
          else
          {
          localStorage.setItem("members",JSON.stringify(json));
          }
          setMembers(json);
          setAllMembers(json);
          // console.log("ALL GET MEMBERS ARE ", json, allMembers);
          // console.log("Setting the ChatRooms Members ...");
          return json;
        }
     

  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }
    catch(e)
{
  console.log("An error TryChat : " + e)
  
}
}

}

async function GetMessageHistory()
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/getmessages/" + props.room.id;
    // console.log("Api getmessages Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      // console.log("getmessages :   => " + JSON.stringify(json))
      
    
      if(json.statusCode == "500" || json.statusCode == "404")
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
            // if(IsAuthOk(json.statusCode) == 1)
            // window.location.reload();
        }

        else
        {
          setMessages(json);
          setAllgood(true);
          // console.log("Setting the ChatRooms Messages ...");
          return json;
          
        }
     

  })
  .catch((error) => {
      console.log("An error occured  get Message: " + error)
      return error;
  })

    }
}



async function FetchRelationshipNarjdal(friendName : string) {

  const loggeduser = localStorage.getItem("user");
  if (loggeduser) {
    const current = JSON.parse(loggeduser);
    console.log("Fetching Relationship    Infos   => "  +  friendName +  " I am : " + current.nickname  );

    let endpoint = 'http://localhost:5000/player/statusFriendship/' + friendName
    // let nicknametofetch: string = JSON.stringify(params.nickname);
    // console.log(" this endpoint   " + endpoint + " Fetching : " + friendName)
    // http://localhost:5000/statusFriendship/?id=narjdal

    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })



      .then((response) => response.json())
      .then(json => {
        // console.log("The Realtionship is => " + JSON.stringify(json))
        setErrorMessage("");
      

        if(json.statusCode == "404" || IsAuthOk(json.statusCode) == 1)
        {
          setErrorMessage(json.mnessage);
        }
        if(json == "YourBlocked")
        {
          setIfBlocked(true);
          let text = friendName + " Has blocked you !";
        setErrorMessage(text)
        setShowInput(false);
        }
        else if(json == "unblockFriend")
        {
          setIfBlocked(true);
          let text = "You blocked : " + friendName;
        setErrorMessage(text)
        setShowInput(false);
        }
        else
        {
          setShowInput(true);
        }
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        // setRelation("error");
        setErrorMessage("An error occured! Relationship not found ! ");
        return error;
      })

  }

}

async function init_socket()
{
  // if(allMembers)
  // {
    if(!props.room.is_dm)
await GetMembers()
// .then((resp) => {

  socket = io("http://localhost:5000/chat");
  socket.emit('joinroom', { room: props.room.id, user: JSON.parse(localStorage.getItem("user")!) });
  socket.on("addmsg", (data: any) => {
    console.clear();
    /*
  {
    id          Message Id
    sender      Player
    senderId    Id Player
    msg         Text
    createdAt   Time
  }
  */
//  const NewMembers = JSON.parse(localStorage.getItem("members")!);
//   console.log("ALL MEMBERS : ", NewMembers);
  // let srch = NewMembers.filter((m: any) => {
  //   console.log("m.id : " + m.id + " data.senderId : " + data.message.senderId, data);
  //   return m.id === data.message.senderId
  // })[0]
  // if(!srch)
  // srch = JSON.parse(localStorage.getItem("user")!);
  //  console.log("SEARCH RESULT: ", srch);
  
  const msgObj = {
    id: data.message.id ,
    sender:  data.sender,
    senderId: data.message.senderId,
    msg: data.message.msg,
    createdAt: data.message.createdAt,
  }
  // console.log("SRCH IS " ,srch);
  console.log("OLD Messages : ", messages, 'NEW', msgObj);

    // append new message to messages using previous state
    // console.log(" DATA MESSAGE : ",data.message)
  // if(data.message)
  if(props.room.id  == data.message.roomId)
    setMessages((prevMessages: any) => [...prevMessages, msgObj]);

  // setMessages([...messages, msgObj]);

  });

// }
}

  useEffect (() => {

    
    // CONDITION  : 
    let text = "HasRoomAccess" + props.room.id
  let RoomText = "Room:" + props.room.id;
  localStorage.setItem(text,"false");
  localStorage.setItem(RoomText,"");
      // console.log("INSIDE CHATROOMBOX  ID  :  " + props.room.id + " NANE : " + props.room.name + "PROPS : ",props )
      // console.log("CHATROOMBOX ROOM PERM : " + statusMember.data + " muted : " , props.statusMember.data)
   
        if (props.room.is_dm) 
        {

          // console.log("Fethcing Relationship of this chatroom.");
          const loggedUser = localStorage.getItem("user");
            if(loggedUser)
            {
              const current = JSON.parse(loggedUser);
              if(props.room.all_members)
              {

              if(current.id == props.room.all_members[0].player.id)
              {
            // console.log(" THE NICKNAME OF THE FRIEND IS  OF THE ROOM   " +  props.room.all_members[1].player.nickname);
                // setFriendName(props.room.all_members[1].player.nickname)
           FetchRelationshipNarjdal(props.room.all_members[1].player.nickname);
  
              }
              else
              {
            // console.log(" THE NICKNAME OF THE FRIEND IS  OF THE ROOM   " +  props.room.all_members[0].player.nickname);
                // setFriendName(props.room.all_members[0].player.nickname)
           FetchRelationshipNarjdal(props.room.all_members[0].player.nickname);
              }
            }


            }
        }
        else
        {
         
        }
        
        init_socket();
        GetMessageHistory();
      

  }, []);
  useEffect(() => {
    if(localStorage.getItem("noinput") == "true")
    setShowInput(false);
    else
    setShowInput(true);
  },[localStorage.getItem("noinput")])

const SendMessage = (e) => {
  e.preventDefault();
  setIsUpdating(true);

  const loggeduser = localStorage.getItem("user");
  if (!loggeduser) {
    return ;
  }
  var Current_User = JSON.parse(loggeduser);
  console.log(socket);
  setTimeout(() => {
    setIsUpdating(false);
    setisUpdated(true);
    setTimeout(() => setisUpdated(false), 2500);
    // window.location.reload();
 
  }, 2000);
  socket.emit("newmessage", {user: Current_User, msgTxt: inputMsg, room: props.room.id});
  SetInputMsg("");
}

async function LeaveRoom () {

  const text = "http://localhost:5000/player/leaveRoom/" + props.room.id
// console.log("Api Leave Rookm  Link :  =>  " + text);


await axios.get(text,{withCredentials:true})
  //{
//   // mode:'no-cors',
//   method:'get',
//   credentials:"include"
// })

// .then((response) => response.json())
.then(json => {
  // console.log("json" + JSON.stringify(json.data))
  
  // console.log("The response is => " + JSON.stringify(json))
// 
if(json.data.statusCode == "500" || IsAuthOk(json.data.statusCode) == 1)
{
  setErrorMessage("An error occured in the backend.");
  window.location.reload();
}

  navigate("/Landing")
  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
};

const HandleLeaveRoom = (e) => {
  e.preventDefault();
  // console.log("Handle Leave Room Click !" );
  LeaveRoom();

}
const HandleFetchedFriend = (e) => {
  e.preventDefault();
}

//-----------------------//
//Filter User List 
// const FilteredUsers =  useMemo (() => {
//   const FilteredUsers = members.filter(members => {
//   // Here A changer : person with friends from backend , 
//   //filter nickname not name 
//    return members.name.toLowerCase().includes(userQuery.toLowerCase());
// })
// console.log("PROPS IS DM " + props.room.is_dm);
return (
  <div className='body'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
   
        <>
    <div className='ChatRoomBox-card'>
      <div className='ChatBox-container'>
        {props.room.is_dm ? (
          <>

          </> ) : (
            <>
                   <div className='Users-container' >
          <div className='ChatRoomUsers-container' >
          <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUserQuery(event.target.value)}
       value={userQuery || ""}
        />

    {members.map(c => < DisplayChatRoomusers key = {c.nickname} user = {c} isadmin ={"true"} />)}

        </div>
  </div>
  </div>
  </div>

            </>
           )} 

      <div className='History-Box'> 
          {ifBlocked ? (
            <>
            </>
          ) : (
            <>
      {messages.map(c => < MessageList  key = {c.id} user ={c} />)}
            </>
          )}
 
     <br></br>
            
      </div>
      {props.room.is_dm  ? (
        <>

        </>
        ) : (
          <>
           {showInput ? (
            <>
            <button type="button" onClick={HandleLeaveRoom} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      <span> Leave Room</span>
                  </button>
            </>
           ) : (
            <>
            </>
           )}  
          </>)}
          
    {showInput ? ( 
    <>
     <form className='ChatRoom-Input-form' onSubmit={HandleInputMsg}>
    <div className='ChatRoom-InputBox'>
      <input type="text"
       className={`${inputMsg ? "has-value" : ""}`}
       id="textbox"
       placeholder='enter a message'
       onChange={event => SetInputMsg(event.target.value)}
       value={inputMsg || ""}
       /> 
      <label htmlFor="textbox"> 
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
       </label>
</div>
      
       <button
      onClick={SendMessage}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : "Send"}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}

  </form>
    </>
    ) : (
    <>
     <button type="button" className='button-displayuser' >
              <span className="icon material-symbols-outlined">
                {"sentiment_very_dissatisfied"}
              </span>
              <span>     {errorMessage && <div className="error"> {errorMessage} </div>}
  </span>
            </button>

    </>
    )} 
 
  </div>
  </div>
        </>
   
    
  </div>
  )
};
export default ChatRoomBox;
