import React from "react";

import Contact from "./Contact";
import { useState ,useEffect} from "react";
import './ContactList.css'
import SearchBar from '../users/SearchBar'

import { io } from "socket.io-client";
import { Socket } from 'dgram';
// import socket
var socket:any;
const ContactList = (props) => 
{
    const [AddFriend,setAddFriend] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [ContactList,setContactList] = useState([]);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [user42,SetUser42] = useState<any>([])
    const [contacts ,setContacts] = useState <any>([]);
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
    
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          SetUser42(Current_User);
          setContacts(props.contacts);
        }

    },[]);


    const handleSelect = (e) => {
        // e.code == "select"
        e.preventDefault();
        console.log("inside Handle Select ",localStorage.getItem("Dmcount"));
      };
    const handleKey = (e) => {
        e.preventDefault();
        // e.code === "Enter" && handleSearch();
        SetUser42(null);
    };

    return (
        
        <div className="FriendList-container">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        
             <div className="search">
          <SearchBar/>
      {errorMessage && <div className="error"> {errorMessage} </div>}
      {user42 && (
        <div className="userChat" onClick={handleSelect}>
          <div className="userChatInfo">
       
            <span>{contacts.map(c => < Contact  key = {c.nickname} user ={c} />)}</span>

          </div>
        </div>
      )}
    </div>
</div>
    );
};
export default ContactList;