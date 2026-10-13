import React from 'react'
import {Link} from "react-router-dom"

function NotFound() {
  return (
    <div className='flex flex-col gap-2'>
      Your Lost Buddy!
      <Link to ="/">Home</Link> {/* doesn't refresh the whole pahe */}
      {/* <a href="/">Home a</a> refrshes the whole page */}
    </div>
  )
}

export default NotFound
