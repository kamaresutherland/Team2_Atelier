import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; // 👈 Fixed: Removed curly braces
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/HomePage';
import './index.css';
import {Wardrobe} from './pages/Wardrobe';
import {Stylist} from './pages/Stylist';
import {Settings} from './pages/Settings';
import NotFound from './pages/NotFound';


{/* this page mainly just deals with the routing */}


{/* this creates that actual page url for */ }
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound/>,
  }, 
  {
    path: '/wardrobe',
    element: <Wardrobe />,
  },
  {
    path: '/stylist',
    element: <Stylist/>,
  },
  {
    path: '/settings',
    element: <Settings/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
