import react from 'react'
import { useState,useEffect } from 'react';
import './Achievements.css'
import DisplayAchievementsList from './DisplayAchievementsList';
const Achievements = () => {

    const loggeduser = localStorage.getItem("user");
    if (loggeduser)
    {
        var Current_User = JSON.parse(loggeduser);
        
    }
    const AchievementsList = [
        {AchievementsId:0,name:"First try",description:"Play your first game ",image_url:"images/1000_F_224798026_pByZntuv55dc3gxv1KArR6ReyognIyJx.jpeg",unlock:true},
        {AchievementsId:1,name:"Payback",description:"Win a game against a player that you lost again ",image_url:"images/reaper-icon-icon-white-background-reaper-icon-graphic-web-design-reaper-icon-icon-white-background-reaper-icon-176386733.jpeg",unlock:false},
        {AchievementsId:2,name:"Alpha",description:"Be the Top 1 player of the leaderboard",image_url:"images/reaper-icon-icon-white-background-reaper-icon-graphic-web-design-reaper-icon-icon-white-background-reaper-icon-176386733.jpeg",unlock:true},
        {AchievementsId:3,name:"Alpha",description:"Be the Top 1 player of the leaderboard",image_url:"images/610295.png",unlock:false},
        {AchievementsId:4,name:"Alpha",description:"Be the Top 1 player of the leaderboard",image_url:"images/610295.png",unlock:true},
    ];
    return (
        <>
        <div className='body'>
            <div className='Achievements-card'>
                
      <span>{AchievementsList.map(c => < DisplayAchievementsList  key = {c.AchievementsId} AchievementsList ={c} />)}</span>

            </div>
        </div>
        </>

    );
};

export default Achievements;