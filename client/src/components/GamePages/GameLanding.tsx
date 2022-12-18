import React, { useEffect } from "react";
import { Link } from "@mui/material";
import SpectateGame from "./SpectateGame";
import { useState } from "react";
import DisplayGameList from "./DisplayGameList";
const GameLanding = () => {
    const [GamesArray,setGamesArray] = useState<any>([]);
    // GET LIST OF ROOMS SET IN STATE AND MAP OVER THE LINKS 
useEffect(() => {

},[])
    return(
        <>
           <div className='Roomlist-card'>
            card
      {GamesArray.map(c => < DisplayGameList  key = {c.id} game ={c} />)}

      </div>
        
        </>
    )
}

export default GameLanding;