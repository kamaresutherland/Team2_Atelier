import React, { useState } from 'react' // <-- FIXED: Added { useState } here
import {NonNavBar,  NavBar} from '../components/Navbar'
import Hero from '../components/Hero'
import '../index.css'

const Home = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light') /* uses the theme that was used from toggle button, if none sets it to light mode */
  
  return (
      <div className='dark:bg-black relative'>
        <NonNavBar theme={theme} setTheme={setTheme}/>
        <NavBar theme={theme} setTheme={setTheme}/>
        <Hero />
      </div>

  )
}

export default Home
