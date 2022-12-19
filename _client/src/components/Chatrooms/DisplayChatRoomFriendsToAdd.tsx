import react, { useEffect } from 'react'
import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import './DisplayChatRoomsusers.css'
// import blobz from 'blobz.css'
const DisplayChatRoomFriendsToAdd = (props,roomownnership) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [action,setAction] = useState(false);
    const [display,setDisplay] = useState(false);
    const params = useParams();
    const [isAdmin,setIsAdmin] = useState(JSON.stringify(roomownnership));
//   console.log("isADmin" + JSON.stringify(isAdmin))
    const handleFriendClick  = (e) => {
        e.preventDefault();
        //if() Request to Add Friend , if already : 
        setErrorMessage("You are alredy friend !");
        
    };
    const HandleBlock = (e) => {
        e.preventDefault();
    }
    
    const HandleShowAction = (e) => {
        e.preventDefault();
        setAction(!action);
        // Here request to know which button to display 
    }


async function InviteFriendToRoom () {
    const loggeduser = localStorage.getItem("user");
    if(loggeduser)
  {
    const current = JSON.parse(loggeduser);
    const text = "http://localhost:5000/player/addMember/" + props.user.nickname + "/" + params.id
  // console.log("Api Fetch Link :  =>  " + text);
  
  
  await fetch(text,{
    // mode:'no-cors',
    method:'get',
    credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
    console.log("The ADd Member response is   => " + JSON.stringify(json))
  // 
  if(json.statusCode == "500")
  {
    setErrorMessage("An error occured in the backend.");
  }
  
    return json;
  })
  .catch((error) => {
    console.log("An error occured : " + error)
    return error;
  })
  
  // }
  }
  
  };
    const HandleInviteToRoom = (e) => {
        e.preventDefault();
        console.log("Inviting this user to the chatroom " + props.user.nickname + " The room id is :" + params.id)
      
        if(props.user.nickname)
        {
          InviteFriendToRoom();
        }
        else
        {
          setErrorMessage("Please enter a valid nickname");
        }
      }
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
        if(loggeduser)
        {
            const current = JSON.parse(loggeduser);
            if (current.id == props.user.id)
            {
                setDisplay(false);
            }
            else
            setDisplay(true);
        }
    })
// console.log(" DIsplay ChatRoom Users >>> " + props.user.id)
    return (
        <>
<div className="ChatRoom-HELP"> 
    <table className="ChatRoom-table">
        <tbody>
            {display ? (
                <>
     <tr>
   </tr>
   <tr>
   <td>
 <img src={props.user.avatar!} 
   height="20" 
   className='avatarsidebar'/>
   </td>
   <td>
    <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleInviteToRoom}>
    <span className="icon material-symbols-outlined">
     {"group_add"}  
      </span>
      <span> Add  {props.user.nickname} to the chatroom</span>
      </button>
     </td> 

  <td>
                
 


      
      </td>

   </tr>
                </>
            ) : (
                <>
                </>
            )}
   
   </tbody>
   </table>
   </div>
        </>


       
    )
}
export default DisplayChatRoomFriendsToAdd;