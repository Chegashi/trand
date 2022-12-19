import react from 'react'
import { useState,useEffect } from 'react';
import './DisplayAchievementsList.css'
const DisplayAchievementsList = (props) => {


    return (
        <>
        <div className='Achievements-Back'>
            <div className='Achievements-container'>
        <ul className='AchievementsList'>
        
            <li>
            
  {props.AchievementsList.unlock ? (
<>
<div className='unlocked-div'>
<img  className='avatar1' src={props.AchievementsList.image_url} /> 
<span>{props.AchievementsList.name} </span> 
<span>{props.AchievementsList.description} </span>
    
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"lock_open"}        </span> 
      </button>
      </div>
</>
  ):(
<>
<div className='locked-div'>
<img  className='avatar1' src={props.AchievementsList.image_url} /> 
<span>{props.AchievementsList.name} </span> 
<span>{props.AchievementsList.description} </span> 
    
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"lock"}        </span> 
      </button>
      </div>
</>
  )}
</li>
        </ul>
        </div>
        </div>
       
        </>
    )
}

export default DisplayAchievementsList