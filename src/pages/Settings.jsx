import React from 'react'
import '../index.css'
import {Link} from "react-router-dom"

function Settings() {
  return (
    <div>
      <h1 className='heading text-center text-6xl'>Settings</h1>
      <Link to ="/">Home</Link> 
    </div>
  )
}

export default Settings
