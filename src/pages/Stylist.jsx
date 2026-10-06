import React, {useState} from 'react';
/*import {NavLink} from "react-router-dom";
import { useParams } from 'react-router-dom';*/
import { NavBar, NonNavBar } from '../components/Navbar';
import '../index.css'
import Hero from '../components/Hero';


function Stylist() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light') /* uses the theme that was used from toggle button, if none sets it to light mode */
    
  return (
     <div className='dark:bg-black min-h-screen relative'> {/* main container (background color of page*/}
      {/* pt-2 allows the "STYLIST" to be moved down without leaving a gap */}
      <div className='flex justify-center items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70'>
      <h1 className='heading text-center position-fixed pt-5 text-6xl dark:text-white' >Stylist</h1>
      </div>
     {/* <NavLink to ="/" className={({isActive}) => {return isActive? 'text-primary-700' : '' }}>Home</NavLink> */} 
      <div>
        <NavBar theme={theme} setTheme={setTheme}/>
      </div>

    </div> /* end of main container */
  )
}

export {Stylist};
