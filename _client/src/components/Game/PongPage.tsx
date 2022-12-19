import React, { useState }  from 'react';
// import TempoNav from '../TempoNav/NavbarGame';
import Game from '../Game/Game'
// import GameRooms from '../Game/GameRooms';
import GameLive from '../Game/gameLive';
import io from 'socket.io-client';

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

// export function GameRooms(props: any) {
//   const [rooms, setRooms] = useState<any>([]);
//   let Socket = io('http://localhost:5000/game');
//   Socket.on('connect', () => {});
//   Socket.on('getAllGames', (data: any) => {
//     console.log(rooms);
//     setRooms(data.rooms);
//   });

//   return (
//     <>
//       <h1>Game Rooms</h1>
//       {rooms.forEach((room: any) => {
//         <div className="room__name" onClick={(props.roomId = room.idRoom)}>
//           {room.player_1} VS {room.player_2}
//         </div>;
//       })}
//     </>
//   );
// }

const Pong = () => {
  const [roomId, setRoomId] = React.useState(0);
  return (
    <>
    {/* <div className='game-lives'>
    {<GameRooms/>}
    {roomId && <GameLive roomId = {roomId} />}
    </div> */}
    <div className='game-canvas'>
      {!roomId && <Game width = "600" height="400" />}
    </div>
    </>
  );
};

export default Pong;