import { match } from 'assert';
import react from 'react'
import {useState, useEffect} from 'react'
import {Link} from'react-router-dom';

import './DisplayMatchHistory.css'
const DisplayMatchHistory = (props) => {

    return (
        <>
 {props.match.winner ? (
 <>
 <div className='winner-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"military_tech"}  Victory      </span> 
      </button>
      </div>
 </>
) : (
    <>
    <div className='loser-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"smart_outlet"}  Defeat      </span> 
      </button>
      </div>
    </>
)}

<div className="Match-History"> 
    <table className="History-Table">
        <tbody>
   <tr>
    <th></th>
    <th>   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"person"}        </span> 
      </button>
      </div></th>
    <th>
   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"stadia_controller"}        </span> 
      </button>
      </div>
   </th>
   <th>   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"person"}        </span> 
      </button>
      </div></th>
</tr>
<tr>
<td>
   <img src = {props.match.image_url}  className="avatar1" height="35"/>
</td>
<td>
{props.match.nickname}
</td>
    
<td>
    {props.match.finalScore}
</td>

<td> <Link style={{color:'#1e90fe'}} to={`/users/${props.match.P2UserId}`} >{props.match.P2nickname}</Link>
</td>


<td>
    
   <img src = {props.match.P2image_url}  className="avatar"/>
</td>
    </tr>
    </tbody>
    </table>
    </div>
        </>

    )
}


export default DisplayMatchHistory;