import IplayPong from './Game';
import p5Types from "p5";
import Sketch from "react-p5";
import { useState, useEffect } from 'react';
import p5 from "p5";
import { io } from 'socket.io-client';
import { Navigate, useNavigate } from 'react-router-dom';
let socket:any;
export type IplayPong = {
  gameId?: string;
  playerLeft: { name: string; position: number; score: number; };
  playerRight: {name: string; position: number; score: number;};
  ball: { x: number; y: number; };
  isPlaying: boolean;
  musicIndice: string;
  userRool: string;
};

export interface IGameContextProps {
  pongClass: any;
  numberOfPlayers: number;
  playerTool: string;
  difficulty: string;
  mode: string;
  buttons: { online?: any; offline?: any; oneplayer?: any; twoplayer?: any; mouse?: any;
    keybord?: any; easy?: any; medium?: any; hard?: any; };
  sound: { hit: any; wall: any; left: any; right: any; };
  pongData: IplayPong;
  radius: number;
  socket:any;
  gameStatue: string;
  playerPosition: number;

  // setNumberOfPlayers: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  // setPlayerTool: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  // setDifficulty: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  // setMode: (ctx: p5.Renderer, width: number, height: number, buttons: any) => void;
  setPongData: (pongData: IplayPong) => void;
}
const defaultState: IGameContextProps = {
  pongClass: null,
  numberOfPlayers: 0,
  playerTool: "",
  difficulty: "",
  mode: "",
  buttons: { online: null, offline: null, oneplayer: null, twoplayer: null, mouse: null,
    keybord: null, easy: null, medium: null, hard: null, },
  sound: { hit: null, wall: null, left: null, right: null, },
  pongData: {
    playerLeft: { name: "", position: 0.375, score: 0, },
    playerRight: { name: "", position: 0.375, score: 0, },
    ball: { x: 0.5, y: 0.5, },
    isPlaying: false,
    musicIndice: "",
    userRool: "",
  },
  radius: 0,
  socket: null,
  gameStatue: "InLoading",
  playerPosition: 0.375,

  setPongData: (pongData:any) => {
    defaultState.pongData = pongData;
  },
};

export default function GameLive(props: any) {
  const navigate = useNavigate();

  // const navigateGa

  const [watching,setWatching] = useState(false);
  const [inGame,setInGame] = useState(true);

  const [gameState, setGameState] = useState(defaultState);

  useEffect(() => {
    gameState.socket = io("http://localhost:5000/game");

    gameState.socket.on("connect", () => {
        console.log(gameState.socket); 
    });

    // if(gameState.socket)
    // {
      console.log("Still Watching ...")
  
    // }

  

  },[])
    const radius = Math.sqrt(props.width * props.width + props.height * props.height) * 0.028;
    let sound: { hit: any; wall: any; left: any; right: any; };
    let ctx: any;

    // let pongData =  {
    //     playerLeft: { name: "", position: 0.375, score: 0, },
    //     playerRight: { name: "", position: 0.375, score: 0, },
    //     ball: { x: 0.5, y: 0.5, },
    //     isPlaying: false,
    //     musicIndice: "",
    //     userRool: "",
    //     };

   
    const setup = (p5: p5Types, canvasParentRef: Element) => {
    ctx = p5.createCanvas(props.width, props.height).parent(canvasParentRef);

        // sound.hit = new Audio(require("./assets/hit.mp3"));
        // sound.wall = new Audio(require("./assets/wall.mp3"));
        // sound.left = new Audio(require("./assets/left.mp3"));
        // sound.right = new Audio(require("./assets/right.mp3"));
        gameState.sound.hit = new Audio(require("./assets/hit.mp3"));
        gameState.sound.wall = new Audio(require("./assets/wall.mp3"));
        gameState.sound.left = new Audio(require("./assets/left.mp3"));
        gameState.sound.right = new Audio(require("./assets/right.mp3"));
  
      
    
    p5.frameRate(60);

    }

    const draw = (p5: p5Types) => {
      if(inGame)
      {

        p5.fill(0, 0, 102);
        p5.rect(0, 0, props.width, props.height);
        p5.textSize(props.width / 15);
        p5.text(gameState.pongData.playerLeft.score, props.width / 4, props.height / 8);
        p5.text(gameState.pongData.playerRight.score, (props.width * 3) / 4, props.height / 8);
        p5.textSize(props.width / 20);
        p5.text(gameState.pongData.playerLeft.name, (props.width * 3) / 16, (props.height * 2) / 8);
        p5.text(gameState.pongData.playerRight.name, (props.width * 11) / 16, (props.height * 2) / 8);
        for (let i = 0; i <= 10; i++) {
          p5.rect(props.width * 0.49, (i * props.height) / 8, props.width * 0.02, props.height / 20);
        }
        p5.fill(192, 238, 253);
        p5.circle(gameState.pongData.ball.x * props.width, gameState.pongData.ball.y * props.height,
          radius);
        p5.fill(102, 181, 255);
        p5.rect(0, gameState.pongData.playerLeft.position * props.height, props.width / 60,
        props.height / 4);
        p5.fill(77, 77, 255);
        p5.rect(props.width - props.width / 60,
        gameState.pongData.playerRight.position * props.height, props.width / 60, props.height / 4);
        if (gameState.sound.hit === "hit") {
          sound.hit.play();
        }
        if (gameState.sound.left === "left") {
          sound.left.play();
        }
        if (gameState.sound.right === "right") {
          sound.right.play();
        }
        if (gameState.sound.wall === "wall") {
          sound.wall.play();
        }
      }
        gameState.socket.emit("watchGame", {gameId:props.roomId
          ,user:localStorage.getItem("user")!});

        console.log("Width : ",props.width , "Height " , props.height)

        if(inGame)
        {

        gameState.socket.on("WatchUpdate", (data: any) => {
          console.log("Update : ",data)
          const pongParsed = JSON.parse(data.pongData);
          if(pongParsed.isPlaying)
          {
            console.log("they are still playing !")
          gameState.pongData = pongParsed;
          }
          else
          {
            console.log("Game ended !")
            gameState.gameStatue = "endGame";
            p5.background(0);
            p5.fill(255);
            p5.textSize(props.width / 10);
            p5.textSize(props.width / 20);
      p5.text("Game Is Over", props.width / 4, props.height / 2);

            p5.text("  Press Enter To Go Back ", props.width / 4, (props.height * 3) / 4);
            setInGame(false);
            if (p5.keyIsDown(p5.ENTER)) {
              navigate('/GameLanding')
              // window.location.reload();
            }
            

          }
        
          // if(data.pongData)

          setWatching(true);
            // pongData = pongParsed;
            // setPongData
        });

        gameState.socket.on("GameNotFound", (data: any) => {
          console.log("Game Not Found : ",data)

          // console.log("Game ended !")
          gameState.gameStatue = "endGame";
          p5.background(0);
          p5.fill(255);
          p5.textSize(props.width / 10);
          p5.textSize(props.width / 20);
    p5.text("Game Not Found ", props.width / 4, props.height / 2);

          p5.text("  Press Enter To Go Back ", props.width / 4, (props.height * 3) / 4);
          setInGame(false);
          if (p5.keyIsDown(p5.ENTER)) {
            navigate('/GameLanding')
            // window.location.reload();
          }

        })
      }
  
    }
    return (

        <div className="App">
          LIVE GAMES
          {/* {inGame ? (
            <>
      <Sketch setup={setup} draw={draw}/>

            </>
          ) : (
            <>
            </>
          )} */}
      <Sketch setup={setup} draw={draw}/>

    </div>
    );
}