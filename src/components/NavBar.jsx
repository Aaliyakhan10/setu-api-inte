import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <div>
        <ul className='flex justify-center gap-10 p-5 bg-teal-800 text-white'>
            <NavLink to="/">Home</NavLink>
             <NavLink to="/status">Status</NavLink>
            <NavLink to="/sign-doc">Sign e Document</NavLink>
            <NavLink to="/setting">Setting</NavLink>
           
        </ul>
    </div>
  )
}

export default NavBar