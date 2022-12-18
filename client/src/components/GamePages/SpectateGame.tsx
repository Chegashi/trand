import react from "react"
import { useParams } from "react-router-dom";
import { useEffect , useState } from "react";

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


useEffect(() => {
    const roomId = params.gameId;
    if(roomId)
    {

    }
    },[])

        return(
            <>
        <div className="SpectateGame-Card">
            <ul className="chat-room-list">
                <li>
                {rooms.forEach((room: any) => {
            <div className="room__name" onClick={(room.roomId = room.idRoom)}>
             
            </div>;
          })}
                </li>
        </ul>
    </div>
        </>
    )
}

export default SpectateGame;