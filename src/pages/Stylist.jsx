import React from 'react'
import '../index.css'
import {Link} from "react-router-dom"

function Stylist() {
  return (
    <div>
      <h1 className='heading text-center text-6xl'>Stylist</h1>
      <Link to ="/">Home</Link> 
    </div>
  )
}

export default Stylist
