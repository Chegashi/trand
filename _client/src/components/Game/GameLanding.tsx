import React, { useEffect } from "react";
import { Link } from "@mui/material";
import SpectateGame from "../GamePages/SpectateGame";
import { useState } from "react";
import DisplayGameList from "./DisplayGameList";
import io from "socket.io-client";
import './GameLanding.css'

const GameLanding = () => {
    const [GamesArray,setGamesArray] = useState<any>([]);

useEffect(() => {
    // console.log("Inside Game Landing ! HHHHHHHHHHHHHWWWWW ")
    let socket = io("http://localhost:5000/game");

    // GET LIST OF ROOMS SET IN STATE AND MAP OVER THE LINKS
        socket.on("connect", () => {
  
    }); 

    console.log("Emiting here ! ")
    socket.emit ("getAllGames", localStorage.getItem("user")!);


    socket.on("getAllGames", (data: any) => {
      console.log("GetALlRooms data : ",data)
      setGamesArray(data.games);
      }); 

},[])
    return(
        <>
           <div className='Games-card'>
            {/* HHHHHHHHHHHHH */}
            GameList
      {GamesArray.map((c:any) => < DisplayGameList  key = {c.id} game ={c} />)}

      </div>
        
        </>
    )
}

export default GameLanding;