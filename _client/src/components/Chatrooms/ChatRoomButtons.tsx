import react from 'react';
import { useState ,useEffect} from "react";
import './ChatRoomButtons.css'
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import person from '../users/users.json'
import { useParams } from 'react-router-dom';
import DisplayChatRoomFriendsToAdd from './DisplayChatRoomFriendsToAdd';

const ChatRoomButton = () => {
  const[friends,setFriends] = useState <any >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();
const [username, setUsername] = useState("");



async function FetchUserInfo (nickname) {

const text = ("http://localhost:5000/player/listToAddFriend/" + params.id);
// console.log("Api ListToAddFriend Link :  =>  " + text);

await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  // console.log("The ListToAddFriends  is => " + JSON.stringify(json))
if(json.statusCode == "500")
{
  console.log("An error occured in the backend.");
}
else
setFriends(json);


  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}
useEffect(() => {
  const loggeduser = localStorage.getItem("user");

  if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const {id} = Current_User
  FetchUserInfo(Current_User.nickname);
}
},[]);




const FilteredUsers = friends.filter(friends => {
    // Here A changer : person with friends from backend , 
    //filter nickname not name 
     return friends.nickname.toLowerCase().includes(username.toLowerCase());
  })
    return (
        <div className='ChatRoomButtons-container'>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        <div className='ChatAddFriends-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in your"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        </div>

        {username ? (
<>
{FilteredUsers.map(c => < DisplayChatRoomFriendsToAdd key = {c.nickname} user = {c} />)}

</>
        ) : (
<>
</>
        )}
           


        </div>
    );
}

export default ChatRoomButton;