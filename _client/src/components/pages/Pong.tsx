import React from 'react';
import TempoNav from '../TempoNav/NavbarGame';
import Game from '../Game/Game'
import './PongPage.css'
const Pong = () => {
  return (
    <>
    <div className='game-canvas'>
      <Game width = "400" height="400" />
      </div>
    </>
  );
};
  
export default Pong;