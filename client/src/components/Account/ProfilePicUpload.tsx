import react, { useEffect } from 'react';
import { useState } from "react";
import person from '../users/users.json'
import {Routes, Route, useNavigate} from 'react-router-dom';
import './ProfilePicUpload.css'
import axios from 'axios';


// https://stackoverflow.com/questions/23427384/get-form-data-in-reactjs
const ProfilePicUpload = (props) => {
	// const [user42,SetUser42] = useState <any>([]);
	const[user42,setUser42] = useState <any >([]);
    const [authenticated, setauthenticated] = useState("");
	const [selectedFile, setSelectedFile] = useState([]);
	const [nickName, setNickName] = useState("");
	const [isFilePicked, setIsFilePicked] = useState("");
	const [isFilePicked2, setIsFilePicked2] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
    const [Updated, setisUpdated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
    const navigateAccount = () => {
        // 👇️ navigate to /contacts
        navigate('/Account');
      };

    const handlePseudoChange = (e) => {
        e.preventDefault()
        console.log("nickame :" + e.target[0].value);
        setNickName(e.target[0].value);

      }
	const changeHandler = (event) => {
        event.preventDefault()
		console.log("Setting the file => " + event.target.files[0])
		setSelectedFile(event.target.files[0]);
		setIsFilePicked("true");
		if(event.target.files[0])
		setIsFilePicked2(true)
		else
		setIsFilePicked2(false)
	};
// useEffect (() => {
// 	const authenticated = localStorage.getItem("authenticated");
// 	const loggeduser = localStorage.getItem("user");
// 	if(loggeduser)
// 	{
// 		var Current_User = JSON.parse(loggeduser);
// 		console.log("=>>>>> FROM THE DashBoard "   + Current_User.usual_full_name + Current_User.UserId)
// 		SetUser42(Current_User);
// 	}

// },[])
async function UploadPicture(selectedFile)
{
	 const loggedUser = localStorage.getItem("user");
    if(loggedUser)
    {
        const formData = new FormData();
		const UserObject  = JSON.parse(localStorage.getItem("user")!);
		const {id,nickname,image_url} = UserObject

	
	formData.append('file', selectedFile);
	// formData.append('nickname',nickname);
	// formData.append('name',nickname);

	// console.log("The User  => " + JSON.stringify(UserObject))
	// formData.append('id',id);
	// formData.append('image_url',image_url)

	const MyForm = [
		{ file:selectedFile,
		// nickname:Current_User.nickname,
		// UserId:Current_User.UserId,
		// image_url:Current_User.image_url
		}
	]
	const text = ("http://localhost:5000/player/update/avatar");
console.log("Api Post Link :  =>  " + text);

// const response = await axios.post("http://localhost:5000/player/update/avatar'", {
// 	formData
// })
	
// 	onUploadProgress: progressEvent => {
// 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
// 	},
// });

await fetch(text,{
	method:'post',
	credentials:"include",
	body:formData
	
	// body:{
	// 	file:selectedFile
	// }
})
.then((response) => response.json())
.then(json => {
	console.log("The update/Avatar Resp   is => " + JSON.stringify(json))
	if( json.statusCode == "404")
	{
	  setErrorMessage(json.message)
	}
else if (json.statusCode == "401")
{
  setErrorMessage(json.message)
}
else
{
	const test  = JSON.stringify(json.image_url);

	console.log("The Resp Of Update Avatar is  => " + test);
	const current = JSON.parse(localStorage.getItem("user")!);
	const NewUser = [
	  {
		id:current.id,
		nickname:current.nickname,
		avatar:json.image_url,
		firstName:current.firstName,
		lastName:current.lastName,
		email:current.email,
		wins:current.wins,
		loses:current.loses,
		tfa:current.tfa,
		tfaSecret:current.tfaSecret
	  }
	]
	console.log("NEWUSER : " + JSON.stringify(NewUser[0]))
  localStorage.setItem("user",JSON.stringify(NewUser[0]));
  setTimeout(() => {
	  setIsUpdating(false);
	  setisUpdated(true);
	  setTimeout(() => setisUpdated(false), 2500);
	  window.location.reload();
   
	}, 2000);
	// localStorage.setItem("user","");
	// localStorage.setItem("user",test);
	// let UpdatedUser = localStorage.getItem("user");
	// console.log("Update Nick=>     " + JSON.stringify(UpdatedUser));
	
}
	return json;
})
.catch((error) => {
	console.log(" Error Update Avatar" + error)

})
// .then((response) => response.json())
// {
	
// })
// 	}
	// return response.data;

//   console.log("Uploading Picture For this User =>  " + Current_User.UserId);
//   const text = ("http://localhost:9000/update/nickname");
//   console.log("Api Post Link :  =>  " + text);
  
//   const response = await axios.post(text,formData)

//     return response.data;
    }
  
}

	const handleSubmission = (e) => {
		e.preventDefault();
		const file = selectedFile;
        const formData = new FormData();
	
      
        if(isFilePicked2 && selectedFile!)
        {
			// Request to Backend to  Update Profile Picture only 
			// IF error set Error message accordingly 
			console.log("Handle Submission Profile pic upload  : " + selectedFile['name'])
			setIsUpdating(true);
			UploadPicture(selectedFile)
	// 		.then((resp) => {

	// 			// const test  = JSON.stringify(resp);

	// 			// console.log("The Resp is => " +  test );
	// // 			// To fixe ...
	// // 			const loggedUser = localStorage.getItem("user");
	// // 			if(loggedUser)
	// // 			{
    // // var Current_User = JSON.parse(loggedUser);
	// // 			const new_user = [{
	// // 				nickname:resp.nickname,
	// // 				UserId:Current_User.UserId,
	// // 				image_url:resp.image_url
	// // 			}]
	// // 			const bruh = JSON.stringify(new_user)
	// 		// 	localStorage.setItem("user","");
	// 		// 	localStorage.setItem("user",test);
	// 		// 	let UpdatedUser = localStorage.getItem("user");
	// 		// console.log("Updated User After Update Profile Pic =>     " + JSON.stringify(UpdatedUser));
    //   	setTimeout(() => {
    //       setIsUpdating(false);
    //       setisUpdated(true);
    //       setTimeout(() => setisUpdated(false), 2500);
    //     //   window.location.reload();
       
    //     }, 2000);

	// 		})
			
            // setErrorMessage("Please chose a valid username ");
        }
		else
	{
		setErrorMessage("Please chose a valid file !");
	}
        };

	return(
		<>
		 <h3>  Upload a new Profile Picture </h3>
		<form className='login-form'>
			
			<input type="file" name="file" onChange={changeHandler} />
			{isFilePicked2  ? (
				<div>
					<p>Filename: {selectedFile['name']}</p>
					<p>Filetype: {selectedFile['type']}</p>
					<p>Size in bytes: {selectedFile['size']}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile['lastModifiedDate'].toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)}
			   <button
			   type="submit"
      onClick={handleSubmission}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : " Update Profilte picture"}
      </span>
    </button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
      </form>
		
		</>
	)
};

export default ProfilePicUpload ;