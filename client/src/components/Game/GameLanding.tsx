import React, { useEffect } from "react";
import { Link } from "@mui/material";
import SpectateGame from "../GamePages/SpectateGame";
import { useState } from "react";
import DisplayGameList from "./DisplayGameList";
import io from "socket.io-client";

const GameLanding = () => {
    const [GamesArray,setGamesArray] = useState<any>([]);
    let socket = io("http://localhost:5000/game");

    // GET LIST OF ROOMS SET IN STATE AND MAP OVER THE LINKS
        socket.on("connect", () => {
      socket.on("GetAllGamesroom", (data: any) => {
        setGamesArray(data);
        }); 
    }); 
useEffect(() => {

},[])
    return(
        <>
           <div className='Roomlist-card'>
            card
      {GamesArray.map((c:any) => < DisplayGameList  key = {c.id} game ={c} />)}

      </div>
        
        </>
    )
}

export default GameLanding;