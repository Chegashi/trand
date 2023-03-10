import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DisplayUserHome from "./DisplayUserHome";
import { IsAuthOk } from '../../utils/utils';

const SearchBar = () => {
  const [userQuery,setUserQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    const [usertoShow,setUsertoShow] = useState<any>([]);
    const[display,setDisplay] = useState(false);
    const [allgood,setAllgood] = useState(false);



  async function FetchUserInfos ()  {


    const loggeduser = localStorage.getItem("user");
if(loggeduser)
{
     
let endpoint = 'http://localhost:5000/player/profile/?id=';
// endpoint = endpoint + userQuery;
// console.log(" this endpoint   " + endpoint)


try
{


await fetch((`http://localhost:5000/player/profile/${userQuery}`),{
    // mode:'no-cors',
    method:'get',
    credentials:"include"
})


.then((response) => {
  if(!response.ok)
  {
    // console.log(" I MA RESPONSE Ok  ")
    throw new Error("Somethign went wrong");
  }

  else if (response.ok)
  {
    // console.log("RESPONSE IS OK")
  return response.json();

  }
})
.then(json => {

    // console.log("The response is => " + JSON.stringify(json))
  setErrorMessage(""); 
  // localStorage.setItem("usertoshow",JSON.stringify(json));
  if (IsAuthOk(json.statusCode) == 1)
  {
    // console.log("SHOULD RELOAD  ....")
  window.location.reload();
  }
  if(json.statusCode == "404")
  {
    setAllgood(false);
  setErrorMessage(" User not found ! ");

  }
  else
  setAllgood(true);
  setUsertoShow(json);
    return json;

})


}
catch(error)
{
  // console.log("An error occured trycatch : " + error)
  setErrorMessage(" User not found ! ");
  setAllgood(false);
  setUserQuery("");
  
}

}

};

  const HandleFetchUser = (e) => {
    e.preventDefault();
    // console.log("inside Handle fetch user" + userQuery)
  if(!userQuery)
  {
    setErrorMessage("An Error Occured ! ")
    setDisplay(false);
  }
  else
  {
    FetchUserInfos();
setDisplay(true);
  // window.location.reload();
  }
};
const HandleChange  = (e) => {
    setUserQuery(e.target.value);
    setDisplay(false);

}

return (
    <>
    <div className="searchForm">
    <form onSubmit={HandleFetchUser}>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={HandleChange}
       value={userQuery || ""}
        />
   
        </form>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        </div>
         {display ? ( 
            <>
         {allgood ? (
         <>
         <DisplayUserHome  usertoshow={usertoShow} /> 
         </>
         ): (
         <>
         </>
         )} 
       </>
         ): (
            <>

            </>
         )}
    </>

)
};

export default SearchBar