import React, { useState } from 'react' // <-- FIXED: Added { useState } here
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import './index.css'

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light') /* uses the theme that was used from toggle button, if none sets it to light mode */
  
  return (
      <div className='dark:bg-black relative'>
        <Navbar theme={theme} setTheme={setTheme}/>
        <Hero />
      </div>

  )
}

export default App
