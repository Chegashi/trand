import { Link, useParams } from 'react-router-dom';

import './ChatRoom.css';
import ChatRoomBox from './ChatRoomBox'
import ChatRoomButton from './ChatRoomButtons'
import { useState ,useEffect} from "react";
import AdminChatRoomDashboard from './AdminChatRoomDashboard';
import { IsAuthOk } from '../../utils/utils';
import { Pop } from '../../utils/Popup';
import axios from 'axios';

function ChatRoom() {
    const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
    const [roomPerm,setRoomPerm] = useState<any>([])
    const [roomNme,setRoomName] = useState("")
    const [userAdmin,SetUserAdmin] = useState(false);
    const [testRoom,setRoom] = useState<any>([]);
    const [allgood,setAllgood] = useState(false);
    const [isDm,setIsDm] = useState(false);
    const [isProtected,setIsProtected] = useState(false);
    const [statusMember,setStatusMember] = useState("");
    const [haspswd,setHaspsswd] = useState(false)
    const [isPrivate,setIsPrivate] = useState(false)


async function GetPermissions()
{


  const text = "http://localhost:5000/player/Permission/" + params.id;
    console.log("Api Get Permission  Link :  =>  " + text);
    await axios.get(text,{
      withCredentials:true
  })
  
  .then(json => {
      console.log("The response Of Permissions  is  => " + JSON.stringify(json.data))
      setRoomPerm(json);

      if(json.data.statusMember == "You are not a member of this room ")
      {
        console.log("ALLL GOOOOD FALSE ")
        setErrorMessage(" You are not a member of this room.");

        setAllgood(false);
      }
      if(json.data.is_banned == true || json.data.is_muted == true )
      {
        localStorage.setItem("noinput","true");
        setErrorMessage(" You cnanot send a message in this room. You are either banned or muted ");
      }
      if(json.data.statusMember  == "owner")
      {
        console.log("This is the owner of the room");
        setRoomPerm(json);
        SetUserAdmin(true);
      }
      else if(json.data.statusMember == "admin")
      {
        setStatusMember("admin");
        SetUserAdmin(true);
      }
      // if ()
      
      if(json.data.statusCode == "500" || IsAuthOk(json.data.statusCode) == 1)
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
        }
        if(json.data.statusCode == "404")
        {
          if(json.data.message == "You are not a member of this room")
         { 
          setErrorMessage(" You are not a member of this room.");
          setAllgood(false);
        }
        }
        setAllgood(true);
  })
  .catch((error) => {
      console.log("An error occured  while fetching the Pemissions ! : " + error)
      setErrorMessage(" An error occured while fetching the room data . You are not a member of this room.");
      setAllgood(false);
      return error;
  })

}
async function Waiit () {
  // await GetRoomById();
  await GetTypeOfRoom();

  let text = "HasRoomAccess" + params.id
  let RoomText = "Room:" + params.id;
  if (localStorage.getItem(text) == "true")
  {
    // console.log( " ITS TRUE ")
    const room = localStorage.getItem(RoomText);
    if (room)
    {
      setRoomName(JSON.parse(room).name)
    await  Waiter();
    }
    
  }
  else if (localStorage.getItem(text) == "false")
  {
    // setIsProtected(true)
    // console.log(" WHAT IS HAPPENING ")
  }
  // if(!isDm)
  // await GetPermissions();

}

async function Waiter()
{
  let RoomText = "Room:" + params.id;

  const room = localStorage.getItem(RoomText);
  if (room)
  {
    // console.log( "THE PLEASE WORK ROOM  IS " ,JSON.parse(room));
  const RoomObj = await JSON.parse(room);
  setRoom(RoomObj);
  // console.log(" THE ROOM  NAME IS " , RoomObj.name)
  // GetPermissions();
  // console.log("Setting the chatRoom Infos ...");
    // localStorag e.setItem(text,"false");
    // localStorage.setItem(RoomText,"");
    await GetPermissions();
  // setAllgood(true);

    let text = "HasRoomAccess" + params.id
    // localStorage.setItem(text,"false")
  }


}
async function  joinNonProtectedRoom()
{
  const text = "http://localhost:5000/player/joinNonProtectedRoom/" + params.id;
  // console.log("Api joinNonProtectedRoom Link :  =>  " + text);
  

  await axios.get(text,{withCredentials:true}
    // mode:'no-cors',
    // method:'get',
    // credentials:"include"
  )

// .then((response) => response.json())
.then(json => {
    // json.data.id = params.id;
  // console.log("The joinNonProtectedRoom esp : " + JSON.stringify(json.data.room));
  const room = {
    id: params.id
    ,...json.data.romm
    // [json.data],
  }
  setRoom({
    id:params.id,
    ...json.data.room
  });
  setAllgood(true);
  GetPermissions();
  setRoomName(json.data.room.name)
  // setRoomName(json.data.name)
  // setIsDm(false);


  // if(json.data == "dm")
  // {
  //   console.log(" THIS IS A DM GETTYPEOF ROOM");
  //   setAllgood(true)
  //   // localStorage.setItem("isdm","true");
  //   setIsDm(true);
  //   // console.log("the name should be : " )
  // }
   
})
.catch((error) => {

  setErrorMessage("An error occured ! You cannot access this room.");

    console.log("An error occured  while fetching the joinNonProtectedRoom  : " + error)
    return error;
})
}
async function GetTypeOfRoom()
{
  const text = "http://localhost:5000/player/GetTypeOfRoom/" + params.id;
    // console.log("Api GetTypeOfRoom Link :  =>  " + text);
    

    await axios.get(text,{withCredentials:true}
      // mode:'no-cors',
      // method:'get',
      // credentials:"include"
    )
  
  // .then((response) => response.json())
  .then(json => {
    // let statusCode = json.status,
    // success = json.ok;
      // json.data.id = params.id;
    // console.log("The type of this room resp : " + JSON.stringify(json.data));
    if(json.data == "dm")
    {
      // console.log(" THIS IS A DM GETTYPEOF ROOM");
      // setAllgood(true)
      // localStorage.setItem("isdm","true");
      setIsDm(true);
      joinDM();
      // console.log("the name should be : " )
    }
    if(json.data == "public" || json.data == "private")
    {
      setIsDm(false);
        if(json.data == "private")
        {
          // console.log("THIS IS A PRIVATE ROOM ! SETISPRIVATE TRUE ")
          setIsPrivate(true);
        }
        else if (json.data == "public")
        {
          // console.log("THIS IS A PUBLIC ROOM !   ")

        }
      joinNonProtectedRoom();
    }
    if(json.data  == "protected")
    {
    let text = "HasRoomAccess" + params.id
      if(localStorage.getItem(text) == "false")
      setIsProtected(true);

    }
     
  })
  .catch((error) => {
    // setErrorMessage("An error occured ! You cannot access this room.");
    setErrorMessage("An error occured ! This room doesnt exist. ");
  
      console.log("An error occured  while fetching the GetTypeOfRoom  : " + error)
    //   if(error.statusCode == "404")
    //   {
    // setErrorMessage("An error occured ! This room doesnt exist. ");
    //   }
      return error;
  })

}

async function joinDM()
{
  const text = "http://localhost:5000/player/joinDM/" + params.id;
  // console.log("Api joinDM Link :  =>  " + text);
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
  // console.log("The joinDM esp : " + JSON.stringify(json.data.room));
  // if(json.data == "dm")
  // {
    const room ={
      ...json.data.room,
      id:params.id
    }
    setRoom(room);
    setAllgood(true);
    // GetPermissions();
    // GetPermissions();
    // console.log("This is a DM Room");
    if(json.data.room.all_members)
  {

  if(current.id == json.data.room.all_members[0].player.id)
  {
    setRoomName(json.data.room.all_members[1].player.nickname);
  }
  else
  {
    setRoomName(json.data.room.all_members[0].player.nickname);
  }
}
    // setRoomName(json.data.room.name)
    setIsDm(true);
    // console.log(" THIS IS A DM GETTYPEOF ROOM");
  //   setAllgood(true)
  //   // localStorage.setItem("isdm","true");
  //   setIsDm(true);
  //   // console.log("the name should be : " )
  // }
   
})
.catch((error) => {
  // setErrorMessage("An error occured ! You cannot access this room.");

    console.log("An error occured  while fetching the joinDM  : " + error)
    return error;
})
}

}


useEffect (() =>
      {
        localStorage.setItem("noinput","false");
        setErrorMessage("");
        const loggeduser = localStorage.getItem("user");
          if(loggeduser)
          {
            const current = JSON.parse(loggeduser);
            Waiit();
          }
          return () => {
    let text = "HasRoomAccess" + params.id
  let RoomText = "Room:" + params.id;
localStorage.setItem(text,"false");
localStorage.setItem(RoomText,"");
          }
      },[])
  
    return (
        <div className='ChatRoomMessageBox'>
        {errorMessage && <div className="error"> {errorMessage} </div>}
      {isProtected ? (
        <>
        <div className='PopUp-Card'>
  Please Enter the Room Password : 
  <br/>
  <Pop room={testRoom}/> 
  </div>
        </>
      ) :(
        <>
      
  {allgood ? (
              <>
              <div className='ChatRoomMessageBox'>
               <h2>{roomNme}</h2>
        {errorMessage && <div className="error"> {errorMessage} </div>}
            <h2><ChatRoomBox statusMember={roomPerm}  room={testRoom} 
            /></h2>

            {isDm ? (
              <>

              </>
            ) : (
              <> 
              {!userAdmin && isPrivate  ? (
                <>
                </>
              ) : (
                <>
                <ChatRoomButton/>

                </>
              )}
{userAdmin ? (
    <div>
                <ChatRoomButton/>
      <AdminChatRoomDashboard room={testRoom} statusMember={roomPerm}  />
        </div>
) : (
    <div>
    
        </div>
)}
              </>
              )}
             
            <div>
                <li><Link to="/Landing">?????? Back to all rooms</Link> </li>
            </div>
            <div className="messages-container">
                                {/* TODO */}
            </div>
            </div>
              </> ) : (
                <>
                  
                </>
              )}
        </>
      )}
            
           
            </div>
    );
}

export { ChatRoom };