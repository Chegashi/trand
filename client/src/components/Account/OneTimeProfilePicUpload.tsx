import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import './ProfilePicUpload.css'
import axios from 'axios';
// import { text } from 'stream/consumers';
// https://stackoverflow.com/questions/23427384/get-form-data-in-reactjs
const OneTimeProfilePicUpload = () => {
	const [selectedFile, setSelectedFile] = useState<any>([null]);
	const [nickName, setNickName] = useState("");
	const [loaded,setLoaded] = useState(0);
	// const [value, setValue] = useState("");
	const [isFilePicked, setIsFilePicked] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	// const [UpdateUser,SetUpdateUser] = useState <any>([]);
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

		setSelectedFile(event.target.files[0]);
		if (isFilePicked === "true")
		{
			setIsFilePicked("false");
		}
		else {
		setIsFilePicked("true");
		}

        event.preventDefault()
	};

	// const handleChange = (e) => {

	// 	// setValue(e.target.value);
	  
	// };
	

	  async function UploadData (post)
	  {
        const loggedUser = localStorage.getItem("user");
		if(loggedUser)
		{
		var Current_User = JSON.parse(loggedUser);
		console.log("LoggedUser " + Current_User.UserId);
const text = "http://localhost:8000/users/" + Current_User.UserId;
console.log("Api Post Link :  =>  " + text);

const response = await axios.put(text, post,{
	onUploadProgress: progressEvent => {
		setLoaded(progressEvent.loaded / progressEvent.total!*100);
	},
});
// console.log(" Id : " + JSON.stringify(response.data));
// // setauthenticated("true");
// // SetUser42(response.data);
// // setuser(response.data);
return (response.data);
}
}

async function UploadDataWithProfilePicture (form)
{

	const loggedUser = localStorage.getItem("user");
	if(loggedUser)
	{
	var Current_User = JSON.parse(loggedUser);
	console.log("LoggedUser " + Current_User.UserId);
const text = ("http://localhost:9000/upload_file");
console.log("Api Post Link :  =>  " + text);

const response = await axios.post("http://localhost:9000/upload", form)
	
// 	onUploadProgress: progressEvent => {
// 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
// 	},
// });
// 	}
	return response.data;
	}
}

	const handleSubmission = () => {
        const formData = new FormData();
		

		const UserObject  = JSON.parse(localStorage.getItem("user")!);
		const {UserId} = UserObject


		formData.append('file', selectedFile);
        formData.append('nickname',nickName);
		console.log("The User ID => " + UserId)
        formData.append('id',UserId);

        console.log("Handle Submission : "+ nickName.length)
        if(nickName.length > 0 )
		{
		if (!isFilePicked  || isFilePicked ==="false")
		{

			const post = {nickname:nickName};
			console.log("Currently Upload to Backend : Nickname only" + nickName );
			UploadData(post)
			.then((resp) => 
			{
				let loggedUser = localStorage.getItem("user");
				const test  = JSON.stringify(resp);
				console.log("The Resp is => " +  test + " The Nicknamne => " + resp.nickname);
				console.log("Logged User   " + loggedUser );
				localStorage.setItem("user","");
				localStorage.setItem("user",test);
				const UserObject = JSON.parse(JSON.stringify(loggedUser));
				navigate("/Account");
				// if(!UserObject.nickname)
				// {
					const {usual_full_name,image_url} = UserObject;				const UpdatedUser42 = [
					{
						UserId:resp.id,
						usual_full_name:usual_full_name,
						image_url:image_url,
						nickname:resp.nickname
					}
				]
				// SetUpdateUser({[...UserObject,nickname:"salut"]});
				// localStorage.setItem("user",JSON.stringify(UpdatedUser42));
			// }
				// loggedUser["nickname"]:resp.nickname;
				// loggedUser{nickname:resp.nickname};
				
				// loggedUser{nickname:"resp.nickname"};
			})
		}
		else {
			
			const post = {
				nickname:nickName,
				File:selectedFile
				};
			console.log("Currently Upload to Backend  With ProfilePic ! => " + nickName + " => " + post.File['name']);
			UploadDataWithProfilePicture(formData)
			.then((resp) => 
			{
				// const {UserId,image_url,destination,filename,nickname} = resp;
				const test  = JSON.stringify(resp);
				console.log("The Resp is => " +  test + " => " + resp.nickname);
				localStorage.setItem("user","");
				localStorage.setItem("user",test);
				navigateAccount();
// 				fetchProfilePicture(UserId,image_url,destination,filename)
// 				.then((resp) => {
// // Here not working , Do i Download It Or i just charge the url from the path received before ?
// 				// SetAvatar(resp);
// 				// const test = Buffer.from(resp.data,'binary').toString('base64');
// 				console.log("Response from GetUserPicture  ! " );
// 				navigateAccount();

// 				})
// 				let UpdatedUser = localStorage.getItem("user");
// 				console.log("Logged User   " + UpdatedUser);
				// const UserObject = JSON.parse(JSON.stringify(UpdatedUser));
				// // if(!UserObject.nickname)
				// // {
				// 	const {usual_full_name,image_url} = UserObject;				const UpdatedUser42 = [
				// 	{
				// 		UserId:resp.id,
				// 		usual_full_name:usual_full_name,
				// 		image_url:image_url,
				// 		nickname:resp.nickname
				// 	}
				// ]
				// SetUpdateUser({[...UserObject,nickname:"salut"]});
				// localStorage.setItem("user",JSON.stringify(UpdatedUser42));
			// }
				// loggedUser["nickname"]:resp.nickname;
				// loggedUser{nickname:resp.nickname};
				
				// loggedUser{nickname:"resp.nickname"};
			})
		}

		// fetch(
		// 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
		// 	{
		// 		method: 'POST',
		// 		body: formData,
		// 	}
		// )
		// 	.then((response) => response.json())
		// 	.then((result) => {
		// 		console.log('Success:', result);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error);
		// 	});
		
        }
		
        else
        {
            setErrorMessage("Please chose a valid username ");
            
        }
        };

	return(
		
   <div className='body'>
	  <div className="login-card">
       <h2> Welcome ! </h2>
	   <h3> Please chose a nickname : </h3>
      <form className='login-form' onSubmit={handlePseudoChange}>
	  <div className="ProfilePic-textBox">
	  <input type="text"
       className={`${nickName ? "has-value" : ""}`}
	   id="textbox"
       onChange={event => setNickName(event.target.value)}
       value={nickName || ""}
       />
      		<label htmlFor="textbox">Your Nickname</label>
   		 </div>
			<h2> Choose a Profile Picture : </h2>
			<input type="file" 
			name="file" 
			id="file"
			placeholder='Please chose a Profile Picture'
			onChange={changeHandler} />
			{isFilePicked == "true" ? (
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
				<h4>Select a file to show details</h4>
			)}
				<button type ="submit" onClick={handleSubmission}>Submit</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
      </form>
	  </div>
		</div>
	)
};

export default OneTimeProfilePicUpload ;