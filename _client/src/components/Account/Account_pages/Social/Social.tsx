import react from 'react'
import {useState,useEffect} from 'react'
import './Social.css'
import DisplaySocial from './DisplaySocialList'
import { IsAuthOk } from '../../../../utils/utils'
const Social = () => {

  const[friends,setFriends] = useState <any >([]);
  const [errorMessage, setErrorMessage] = useState("");

    async function FetchUserInfo (nickname) {

        // ]
      const loggeduser = localStorage.getItem("user");
    
      if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
      const text = ("http://localhost:5000/player/listOfFriends");
      console.log("Api ListOfFriends Link :  =>  " + text);
      
  
      await fetch(text,{
        // mode:'no-cors',
        method:'get',
        credentials:"include"
    })
    
    .then((response) => response.json())
    .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        if(IsAuthOk(json.satusCode) == 1)
        {
          window.location.reload();
        }
        if(json.statusCode == "404")
    {  
      setErrorMessage(json.message)
    }
        else
        {
        setFriends(json);
        }
    
        return json;
    })
    .catch((error) => {
        console.log("An error occured : " + error)
        return error;
    })
  
      }
    }
    
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
      
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);

      FetchUserInfo(Current_User.nickname)
        }
    },[])
    return (
        <>
        <div className='body'>
            <div className='Social-card'>
                <h3>Social</h3>
                {errorMessage && <div className="error"> {errorMessage} </div>}
            <span>{friends.map(c => < DisplaySocial  key = {c.id} Friends ={c} />)}</span>

            </div>
        </div>
        </>
    )
}

export default Social;