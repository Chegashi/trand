import react from "react"
import { useParams } from "react-router-dom";
import { useEffect , useState } from "react";
import io from "socket.io-client";
import GameLive from "../Game/gameLive";
export type IroomsPong = {
    gameId : number,
    playerLeft: {
      name: string;
      score: number;
    };
    playerRight: {
      name: string;
      score: number;
    };
};

const SpectateGame = () => {

    const [rooms, setRooms] = useState<any>([]);
    const params = useParams();
    const [gameId,setgameId] = useState("");

useEffect(() => {
    const gameId = params.id;
    console.log("Inside Spectate game ! " ,gameId)

    if(gameId)
    {
        setgameId(gameId)
        let socket = io("http://localhost:5000/game");

        // GET LIST OF ROOMS SET IN STATE AND MAP OVER THE LINKS
            socket.on("connect", () => {
      
        }); 

        console.log("Emiting here ! ")
        socket.emit ("watchGame",{
            gameId:gameId,
            user:localStorage.getItem("user")!
        });
    }
    },[])

        return(
            <>
        <div className="SpectateGame-Card">

            <GameLive roomId = {gameId }width = "600" height="400" />
    </div>
        </>
    )
}

export default SpectateGame;