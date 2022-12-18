import React from "react";

import SpectateGame from "../GamePages/SpectateGame";

const DisplayGameList = (props:any) => {

    return(
        <>
            GameList
            <ul className="chat-room-list">
                <li>
         {/* <Link to={`/SpectateGame/${props.gameId}`}> {props.game.player_1} VS {props.game.player_2}</Link>  */}
                </li>
            </ul>
        </>
    )
}

export default DisplayGameList;