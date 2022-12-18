import React from "react";
// import {Link} from'react-router-dom';
import { useState ,useEffect} from "react";
// import DmWindow from "../DirectMsg/DmWindow"
import './Contact.css'
// import { io } from "socket.io-client";
// import { Socket } from 'dgram';
// import socket
// var socket:any;
const Contact = (props) => {
	const [OpenMsg, SetOpenMsg] = useState(false);
    // const [OpenBox,setOpenBox] = useState(true);
    const [imLogged,setImLogged] = useState(false);
    // console.log(props.name);
    const [Dmcount,SetDmCount] = useState(-1);
const handleClick = (e) => {
e.preventDefault();

if(!OpenMsg)
{
    // let tt = Dmcount + 1;
    let tt = parseInt(localStorage.getItem("Dmcount")!);
    // const tt = Dmcount + 1;
    
     tt = tt + 1;
    console.log(" TRUE " + tt);
    SetDmCount(tt);
    // let tt = parseInt(localStorage.getItem("Dmcount")!);
    // console.log("Parsed => "  + tt);
    // tt = tt - 1;
    // console.log(" => "  + tt);

    localStorage.setItem("Dmcount",(tt).toString());
    // var = var  - 1;
    // localStorage.setItem("Dmcount",var.toString());
}

if(OpenMsg)
{
       const tt = Dmcount - 1
    // tt = tt - 1;
    SetDmCount(tt);
    console.log(" FALSE "   + tt);
    // localStorage.setItem("Dmcount",(tt).toString());
}

    SetOpenMsg(!OpenMsg);

    
   // if(!OpenMsg)
    // SetDmCount(Dmcount - 1);
        // if(Dmcount === "1" )
    // {
    //     console.log("Inside Dm Count")
    //     SetDmCount("0");
    
    // }
    // else if ( Dmcount === "0")
    // {
    //     // localStorage.setItem("DmCount","1");
    // SetDmCount("1");
    // }
    // if(Dmcount == "0")
    // SetDmCount("1");
    
}
useEffect(() => {

    // console.log("INSIDE SOCIAL SHOUD FETCH IF LOGEGD ")

    
    // socket.on("onlineUsersFront", (data: any) => {
    //   console.log("OnLine e e e e e: ", data);
    //   localStorage.setItem("online",JSON.stringify(data))
},[])
useEffect (() => {

    let onlineUsers = localStorage.getItem("online");
    if(onlineUsers)
    {
        let ParsedUsers = JSON.parse(onlineUsers);
        console.log ( "PARSED USER : " , ParsedUsers);

    let srch = ParsedUsers.filter((m: any) => {
    console.log(" ME id : " + props.user.id + "  ME NICKNAME : " + props.user.nickname  +  " : " , m.user);
    return m.user === props.user.id
  })[0] 

    if(srch)
    {
        console.log(" THIS FRIEND IS LOGEED IN  ")
        setImLogged(true);
    }
    else
    {
        console.log( " THIS FRIEND NOT LOGGED IN ");
        setImLogged(false);
    }
        // const isInsideLoggedUsers = ParsedUsers.filter(s => s.id);
    }
    // if(props.user.id == )
    // console.log("Dm Window opened !" + Dmcount);

// localStorage.setItem("Dmcount",(Dmcount).toString());
// }
},[])
// console.log("OPENBOX =>>>>>> " + OpenBox);
const RedirFriendProfile = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/users/" + props.user.nickname;
    // window.location./// <reference path="" />
    // ("http://localhost:3000/")

}
return (
<div className="Contact-HELP"> 
    <table className="Contact-table">
        <tbody>
    <tr>
       <th></th>
       <th>Name</th>
       <th>Status </th>
   </tr>
   <tr>
   <td> <img src={props.user.avatar} 
   height="20"
   className="avatar1"
   onClick={handleClick} /></td>
    {/* {OpenMsg ? (
                    <td> 
                            
                     <DmWindow contact={props.user}/> 
                     </td>
              ) : (
                <td></td>
              )} */}
   <td> 
  
   <p> <button onClick={RedirFriendProfile}>{props.user.nickname}</button> </p>
    </td> 
  {imLogged ? (
                 <td>  
                    <div className="icon-div">

                         <button type="button" className='has-border' >  
                 <span className="icon material-symbols-outlined">
                {"check_circle"}        </span> 
                 </button>
                 </div>
                 
                    </td>
              ) : (
              <td> 
                    <div className="icon-off-div">
                 <button type="button" className='has-border' >  
              <span className="icon material-symbols-outlined">
             {"cancel"}        </span> 
              </button>
              </div>
                 </td>
              )}

</tr>
        </tbody>
    </table>
  
    </div>
);
};

export default Contact;


