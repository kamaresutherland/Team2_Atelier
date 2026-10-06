import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import assets from '../assets/assets';
import ThemeToggle from './ThemeToggle';

/* This function just includes the logo and the name */

const NonNavBar = () => {
  return (
    <div className="flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70">
      {/* main container above */}
      {/* Logo Section */}
      <div className="text-black font-oleo text-6xl dark:text-white">
        <h1 className="heading">Atelier</h1>
      </div>
    </div> /* end of main container */
    );
  };


/* This creates the Navbar/Menu at the top of the page */
const NavBar = ({ theme, setTheme }) => {
  /* vars used to open and close sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false); 
      {/* Navigation Links & Sidebar Menu */}
    return (
      <>
      {/* justify-center places navbar in middle and gap-12 makes it so they are not super close */}
      <div className="flex justify-center gap-12 items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70">
      {/* main container above */}
      <div 
        className={`text-black-700 text-center dark:text-white sm:text-sm 
          ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} 
          max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transition-all`}>
        {/* Close icon for mobile view */}
        
        <img 
          src={assets.close_icon} 
          alt="Close Menu" 
          className="w-5 absolute right-4 top-4 sm:hidden cursor-pointer" 
          onClick={() => setSidebarOpen(false)}
        />

        {/* Links moved inside the container so they display correctly */}
        <Link to="/" onClick={() => setSidebarOpen(false)} className="sm:hover:border-b py-2 sm:py-0">
          Home
        </Link>
        
        <Link to="/wardrobe" onClick={() => setSidebarOpen(false)} className="sm:hover:border-b py-2 sm:py-0">
          Wardrobe
        </Link>
        
        <Link to="/stylist" onClick={() => setSidebarOpen(false)} className="sm:hover:border-b py-2 sm:py-0">
          Stylist
        </Link>
        
        <Link to="/settings" onClick={() => setSidebarOpen(false)} className="sm:hover:border-b py-2 sm:py-0">
          Settings
        </Link>
      </div>

      {/* Right Side Controls (Theme & Mobile Menu Toggle) */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle theme={theme} setTheme={setTheme} />
        
        <img 
          src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} 
          alt="Open Menu" 
          onClick={() => setSidebarOpen(true)} 
          className="w-8 sm:hidden cursor-pointer" 
        />
      </div>
    </div> {/* end of main container */}
  </>
  );
};

export {NonNavBar,NavBar};
