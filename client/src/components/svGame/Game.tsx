import p5Types from 'p5';
import Sketch from 'react-p5';
import Pong from './Pong';

export default function Game(props:any) {
  const width = props.width;
  const height = props.height;
  const radius = Math.sqrt(width * width + height * height) * 0.028;
  const padle_height = height / 4;
  const padle_width = width / 60;
  let player_left_y:number = 0;
  let player_right_y:number = 0;
  let pong:Pong = new Pong("mochegri", "ia");

  let start:boolean = false;
  let btn_start:any = null;

  const hit__ = require('./assets/sounds_hit.mp3');
  const win__ = require('./assets/win.mp3');
  const lose__ = require('./assets/lose.mp3');
  const wall = require('./assets/wall.mp3');
  const hit = new Audio(hit__);
  const win = new Audio(win__);
  const lose = new Audio(lose__);
  const wall_sound = new Audio(wall);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    let ctx = p5.createCanvas(width, height).parent(canvasParentRef);
    btn_start = p5.createButton('Start');
    btn_start.position(ctx.position().x + width / 3, ctx.position().y + height / 3);
    btn_start.mousePressed(start_func);
    btn_start.size(width / 3, height / 3);
    btn_start.style("font-family", "Bodoni");
    btn_start.style("font-size", width / 20 + "px");
    btn_start.style("background-color", "gray");
    p5.frameRate(60);
  }

  let start_func = () => {
    start = true;
    btn_start.hide();
  }

   const preload = (p5: p5Types) =>  {
  }

  const draw = (p5: p5Types) => {
    if (start === false){
      p5.background("slategray");
      p5.textSize(width / 30);  
      p5.fill("black");
      p5.text("mouse for player_1", width / 10 , height  * 8 / 10);
      p5.text("key-up, key-down for player_2", width / 10, height * 9 / 10);
    }
    else{
      p5.fill(0, 40, 77);
      p5.rect(0, 0, width, height);
  
      //score
      let data = pong.update(player_left_y / height, player_right_y / height);
      p5.fill(77, 166, 255);
      p5.textSize(width / 15);
      p5.text(data.player_left.score , width / 4, height / 8);
      p5.text(data.player_right.score, width * 3 / 4, height / 8);
      p5.textSize(width / 20);
      p5.text(data.player_left.id, width * 3 / 16, height * 2 / 8);
      p5.text(data.player_right.id, width * 11 / 16, height * 2 / 8);
      for (let i = 1; i <= 10; i++) {
        p5.rect(width / 2 - width/75 , i * height / 8, width/150, height / 20);
      }
  
      //ball
      p5.fill(179, 240, 255);
      p5.circle(data.ball.x * width, data.ball.y * height, radius);
  
      // player_position = p5.mouseY;
      if (p5.keyIsDown(p5.UP_ARROW) && player_right_y > 0) {
        player_right_y -= 10;
      }
      if (p5.keyIsDown(p5.DOWN_ARROW) && player_right_y < height - padle_height) {
        player_right_y += 10;
      }
      if (p5.mouseY > 0 && p5.mouseY < height - padle_height) {
        player_left_y = p5.mouseY;
      }
      //player_left
      p5.fill(102, 181, 255);
      p5.rect(0, data.player_left.y * height, padle_width, padle_height);
    
      //player_right
      p5.fill(77, 77, 255 );
      p5.rect(width - padle_width, data.player_right.y * height, padle_width, padle_height);

      if (data.still_playing === false) {
        p5.noLoop();
      }
      if (data.music === "hit") {
        hit.play();
      }
      if (data.music === "mochegri") {
        win.play();
      }
      if (data.music === "ia") {
        lose.play();
      }
      if (data.music === "wall") {
        wall_sound.play();
      }
    }
    //background
    
  };

  return (
    <div className="Game">
      	<Sketch className={"ping_pong_game"} setup={setup} draw={draw}
        preload={preload}
			/>
    </div>
  );
}
