import IplayPong from './Game';
import p5Types from "p5";
import Sketch from "react-p5";
import { useState, useEffect } from 'react';
import p5 from "p5";
import { io } from 'socket.io-client';


export default function GameLive(props: any) {

    let socket:any;
    const radius = Math.sqrt(props.width * props.width + props.height * props.height) * 0.028;
    let sound: { hit: any; wall: any; left: any; right: any; };

    let pongData =  {
        playerLeft: { name: "", position: 0.375, score: 0, },
        playerRight: { name: "", position: 0.375, score: 0, },
        ball: { x: 0.5, y: 0.5, },
        isPlaying: false,
        musicIndice: "",
        userRool: "",
        };

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        sound.hit = new Audio(require("./assets/hit.mp3"));
        sound.wall = new Audio(require("./assets/wall.mp3"));
        sound.left = new Audio(require("./assets/left.mp3"));
        sound.right = new Audio(require("./assets/right.mp3"));
        socket = io("http://localhost:5000/game");
        socket.on("connect", () => {
            console.log(socket); 
        });
        socket.emit("watchGame", {roomId:props.roomId});
    }

    const draw = (p5: p5Types) => {
        p5.fill(0, 0, 102);
        p5.textSize(props.width / 15);
        p5.text(pongData.playerLeft.score, props.width / 4, props.height / 8);
        p5.text(pongData.playerRight.score, (props.width * 3) / 4, props.height / 8);
        p5.textSize(props.width / 20);
        p5.text(pongData.playerLeft.name, (props.width * 3) / 16, (props.height * 2) / 8);
        p5.text(pongData.playerRight.name, (props.width * 11) / 16, (props.height * 2) / 8);
        for (let i = 0; i <= 10; i++) {
          p5.rect(props.width * 0.49, (i * props.height) / 8, props.width * 0.02, props.height / 20);
        }
        p5.fill(192, 238, 253);
        p5.circle(pongData.ball.x * props.width, pongData.ball.y * props.height,
          radius);
        p5.fill(102, 181, 255);
        p5.rect(0, pongData.playerLeft.position * props.height, props.width / 60,
        props.height / 4);
        p5.fill(77, 77, 255);
        p5.rect(props.width - props.width / 60,
        pongData.playerRight.position * props.height, props.width / 60, props.height / 4);
        if (pongData.musicIndice === "hit") {
          sound.hit.play();
        }
        if (pongData.musicIndice === "left") {
          sound.left.play();
        }
        if (pongData.musicIndice === "right") {
          sound.right.play();
        }
        if (pongData.musicIndice === "wall") {
          sound.wall.play();
        }
        socket.on("update", (data: any) => {
            pongData = data;
        });
    }
    return (

        <div className="App">
      <Sketch setup={setup} draw={draw}/>
    </div>
    );
}