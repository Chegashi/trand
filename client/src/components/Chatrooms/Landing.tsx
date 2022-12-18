import { chatRooms } from './ChatRoomData.js';
import {Link} from'react-router-dom';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Pop} from '../../utils/Popup';
import { IsAuthOk } from '../../utils/utils';
import DisplayRoomList from './DisplayRoomList';

import './Landing.css'
function Landing() {
    const navigate = useNavigate();
    const [BackendRooms,setChatRooms] = useState<any>([]);
    const  [showinput,setInput] = useState(false);
    const [Roompassword,setRoomPassword] = useState("");
const [errorMessage, setErrorMessage] = useState("");
   const [isUpdating, setIsUpdating] = useState(false);
const [Updated, setisUpdated] = useState(false);
const [prevRoom,setPrevRoom] = useState("");
const [roomid,setRoomId] = useState("");
const [succes,setSuccess] = useState(false);

    const HandleClick = (e) => {
        navigate('/CreateRoom')
    };
    const HandleShowPassword = (e) => {
        e.preventDefault();
        setInput(!showinput)
    }

    const UpdateRoomPassword = (e) => {
        e.preventDefault();
        if(!Roompassword)
        {
          console.log("ERROR");
        setErrorMessage("Error ! No password inputed")    
      }
      else
      {
        
        console.log("Updating room passwond ..." +Roompassword) 
        setErrorMessage("")    
    
        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
          // window.location.reload();
       
        }, 2000);
      }
      }
async function GetRoomList  ()  {


  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/listOfRooms"
    console.log("Api ListOfRooms Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log("The ListOfRooms is => " + JSON.stringify(json))
    if(IsAuthOk(json.statusCode) == 1)
    window.location.reload();
      setChatRooms(json);
  
      return json;
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }

  

}
let idsavior;

const HandleJoinRoom = (e) => {
e.preventDefault();
console.log("JOING THIS ROOM " + idsavior )

// JoinRoom(idsavior)


}
      useEffect (() =>
      {
        const loggeduser = localStorage.getItem("user");
          if(loggeduser)
          {
            const current = JSON.parse(loggeduser);
            GetRoomList();
          }
        localStorage.setItem("members","");
      },[])
    return (
        <>
        <div className='ChatRooms-card'>
            <h2> Join a ChatRoom </h2>
           <button className='CreateChatRoom-button' onClick={HandleClick}> Create a Chat Room </button>
           <div className='Roomlist-card'>
    
      {BackendRooms.map(c => < DisplayRoomList  key = {c.id} room ={c} />)}
      </div>

            </div>
        </>
    );
}

export { Landing };