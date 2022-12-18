import React from "react";
import {Link, Navigate, useNavigate} from'react-router-dom';
import { useState ,useEffect} from "react";

import './DisplayUserHome.css'
import { isImportOrExportSpecifier } from "typescript";
import { io } from "socket.io-client";

const DisplayUserHome = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [currentUser,setCurrentUser] = useState<any>([]);
   const [icon,setCorrectIcon] = useState("");
   const [msg,setMsg] = useState("");
    const[action,setAction] = useState("");
    const navigate = useNavigate();

    let socket = io("localhost:5000", {
        withCredentials: true,
        forceNew: true,
        timeout: 10000, //before connect_error and connect_timeout are emitted.
        transports: ['websocket']
    });

    // const senddMessage = () => {
    //     socket.emit("message", {roomId: 1, 
    //         sender: 4,
    //         msg: "content msg arg[0]",
    //     });
    // }

//     async function ExecuteFriendship (action:string) {

//         console.log("Executing Friendship   Infos     => " + props.usertoshow.nickname + " is being  : " + action + "  Sender : " + props.usertoshow.sender);


//         // const auth =   await 
// let endpoint = 'http://localhost:5000/player/checkisghioua?nickname=';
// endpoint = endpoint + props.usertoshow.nickname + "?action=" + action;
// console.log(" this endpoint ( TODO ) " + endpoint)

// await fetch(endpoint,{
//     // mode:'no-cors',
//     method:'get',
//     credentials:"include"
// })

// .then((response) => { 
//     console.log("the response is " + JSON.stringify(response));;
// return response;
//   })
// .catch((error) => {
//   console.log("An error occured : " + error)
//   setErrorMessage("An error occured!");
//   return error;
// })
        
//     }

useEffect(() => {
   const user =  localStorage.getItem("user");
   if(user)
   {
   const current = JSON.parse(user);
   setCurrentUser(current);
//    console.log("the relation is : " + props.usertoshow.relation + " sender is : " + props.usertoshow.sender);
//    if( props.usertoshow.relation === "friend")
//    {
//     console.log("hello");
//     setCorrectIcon("Block");
//     setMsg("Block User")
//     setAction("Block")
//    }
//   else if(props.usertoshow.relation === "blocked" && props.usertoshow.sender === "me")
//    {
//     console.log("blocked by me  ! Should display Unblock ");
//     setCorrectIcon("lock_open");
//     setMsg("Unblock")
//     setAction("unblock");
//    }
//    else if(props.usertoshow.relation === "blocked" && props.usertoshow.sender !== "me")
//    {
//     console.log("I am blocked !  Should display You are blocked ");
//     setCorrectIcon("sentiment_very_dissatisfied");
//     setMsg("You are blocked ");
//     setAction("youareblocked");

//    }
//   else  if(props.usertoshow.relation === "pending" && props.usertoshow.sender === "me")
//    {
//     console.log("Pending ... ! Sender is me   Should display Pending  ");
//     setCorrectIcon("hourglass_bottom");
//     setMsg("Pending ... ");

//     setAction("pending");
//    }
//    else  if(props.usertoshow.relation === "pending" && props.usertoshow.sender !== "me")
//    {
//     console.log("Pending ... ! Sender is not me    Should display Accept or Refuse !   ");
//     // setCorrectIcon("hourglass_bottom");
//     // setMsg("Pending ... ");

//     // setAction("pending");
//    }
//     else
//     {
//         console.log("not friend ! Should display Add ");
//    setCorrectIcon("people");
//    setMsg("Add")
//    setAction("Add");

//     }
//    if(props.user.)
   }

},[])
const Reload = (e) => {
    e.preventDefault();
        window.location.href= ('/users/' + props.usertoshow.nickname)
}
    return (
        <>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

        <div className="display-user-container"> 
<ul>
   <li>
   <img src={props.usertoshow.avatar} 
   className="avataruser"
     />
     </li>
     <li>
    <Link style={{color:'white'}} to={`/users/${props.usertoshow.nickname}`} >
   <p>   <button onClick={Reload}>  {props.usertoshow.nickname}  </button>  </p>
    </Link>
    </li>
        {/* {props.usertoshow.relation ==="pending" && props.usertoshow.sender !== "me" ? (
            <>
                 <button type="button" className='button-displayuser' onClick={HandleAcceptFriend}>  
         <span className="icon material-symbols-outlined">
     {"Favorite"}  
      </span>
      <span>Accept</span>
      </button>  
          <button type="button" className='button-displayuser' onClick={HandleRefuseFriend}>  
         <span className="icon material-symbols-outlined">
     {"Cancel"}  
      </span>
      <span>Refuse</span>
      </button>
            </>
        ) : (
            <>
            <ul>
            <li>
                <button type="button" className='button-displayuser' onClick={HandleAction}>  
         <span className="icon material-symbols-outlined">
     {icon}  
      </span>
      <span>{msg}</span>
      </button>
      </li>
      </ul>
            </>
        )} */}

      </ul>
      </div>
        </>
    )
}
export default DisplayUserHome;