import React, { useState } from "react"
import assets from "../assets/assets"
import ThemeToggle from "./ThemeToggle"



const Navbar = ({theme,setTheme}) => {
 
    const [sidebarOpen, setSidebarOpen] = useState(false)
    {/* vars used yo open and close siebar */}

    return (
    <div className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70'>
      
       {/* <img src={assets.atelier} className='w-32 sm:w-40' alt=''/>*/}
        <div className='text-black font-oleo text-6xl dark:text-white'>
        <h1 className="heading">Atelier</h1>
        </div>
        
        
        <div className={`text-black-700 dark:text-white sm:text-sm ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transition-all`}>
            {/* the  ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} is what closes the sidebar */}
           {/*above deals with css for Navbar*/}
        

           <img src={assets.close_icon} alt="" className='w-5 absolute right-4 top-4 sm:hidden' onClick={()=> setSidebarOpen(false)}/>
             {/* dealing with closing sidebar in mobile view */}
            
            <a onClick={()=> setSidebarOpen(false)} href="#" className='sm:hover:border-b'>Home</a>
             <a onClick={()=> setSidebarOpen(false)}  href="#wardrobe" className='sm:hover:border-b'>Wardrobe</a>
             <a onClick={()=> setSidebarOpen(false)} href="#laundry" className='sm:hover:border-b'>Laundry</a>
             <a onClick={()=> setSidebarOpen(false)} href="#settings" className='sm:hover:border-b'>Settings</a>
       
            {/* by giving them all onClick, it closes sider bar when someone clicks it */}
        </div>

      
        <div className='flex items-center gap-2 sm:gap-4'>

          <ThemeToggle theme={theme} setTheme={setTheme}/>

            <img src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" onClick={()=> setSidebarOpen(true)} className='w-8 sm:hidden'/>

        </div>

      {/* add possible button here */} 

        
    </div>
  )
}

export default Navbar
