import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-teal-800 text-white p-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold">
          Setu Api - Aadhar eSign
        </NavLink>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
         
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden md:flex justify-center gap-10">
          <NavLink
            to="/sign-doc"
            className={({ isActive }) =>
              isActive ? 'underline' : undefined
            }
          >
            Sign e Document
          </NavLink>
          <NavLink
            to="/status"
            className={({ isActive }) =>
              isActive ? 'underline' : undefined
            }
          >
            Status
          </NavLink>
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              isActive ? 'underline' : undefined
            }
          >
            Setting
          </NavLink>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-center">
          <NavLink
            to="/sign-doc"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? 'underline block' : 'block'
            }
          >
            Sign e Document
          </NavLink>
          <NavLink
            to="/status"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? 'underline block' : 'block'
            }
          >
            Status
          </NavLink>
          <NavLink
            to="/setting"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? 'underline block' : 'block'
            }
          >
            Setting
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
