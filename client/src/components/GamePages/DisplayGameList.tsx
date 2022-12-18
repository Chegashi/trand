import React from "react";

import SpectateGame from "./SpectateGame";

const DisplayGameList = (props) => {

    return(
        <>
            <ul className="chat-room-list">
                <li>
                    GameList
         {/* <Link to={`/SpectateGame/${props.gameId}`}>{props.game.name}</Link>  */}
                </li>
            </ul>
        </>
    )
}

export default DisplayGameList;