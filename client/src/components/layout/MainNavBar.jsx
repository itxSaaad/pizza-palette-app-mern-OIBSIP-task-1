import { useState, useRef, useEffect } from 'react';
import { BiSolidDownArrow, BiSolidUserDetail } from 'react-icons/bi';
import { CgLogIn, CgLogOut } from 'react-icons/cg';
import { FaUserAlt } from 'react-icons/fa';
import { NavLink, Link } from 'react-router-dom';

import Logo from '/android-chrome-192x192.png';

import Button from '../ui/Button';
import CartButton from '../ui/Cart/CartButton';

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropIsOpen, setDropIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);

  const NavItems = [
    {
      route: '/',
      name: 'Home',
    },
    {
      route: '/pizzas',
      name: 'Menu',
    },
    {
      route: '/my-orders',
      name: 'My Orders',
    },
    {
      route: '/about',
      name: 'About',
    },
  ];

  const cartItems = 10;
  const isLoggedIn = true;

  const logoutHandler = () => {
    console.log('Logout');
    setDropIsOpen(!dropIsOpen);
  };

  return (
    <>
      <nav className="fixed bg-white w-screen flex flex-row items-center justify-between px-6 sm:px-16 shadow-sm">
        <NavLink
          href="/"
          className="flex flex-row justify-center items-center text-black font-bold text-xl sm:text-3xl"
        >
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="h-8 w-8 sm:h-14 sm:w-14 mr-2"
          />
          Pizza Palette
        </NavLink>
        {/* // Desktop Menu */}
        <div className="items-center justify-center space-x-4 hidden md:inline-flex">
          {NavItems.map((navItem, index) => (
            <NavLink
              key={index}
              to={navItem.route}
              className={({ isActive }) => {
                if (isActive) {
                  return 'text-lg text-orange-500 border-b-4 border-orange-500';
                }
                return 'text-lg  text-black hover:text-orange-500 hover:border-b-4 hover:border-orange-500';
              }}
            >
              {navItem.name}
            </NavLink>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center space-x-1 sm:space-x-4">
          <CartButton>{cartItems}</CartButton>

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropIsOpen(!dropIsOpen)}
                className="text-black hover:text-orange-500 border-2 border-orange-500 rounded-full inline-flex items-center p-2 focus:outline-none"
              >
                <FaUserAlt />
                <BiSolidDownArrow className="h-3 text-orange-300" />
              </button>
              {dropIsOpen && (
                <div className="absolute right-0 w-48  bg-white border border-gray-300 rounded shadow-lg mt-4">
                  <Link
                    to="/profile" // Replace with the actual profile route
                    onClick={() => setDropIsOpen(!dropIsOpen)}
                    className="inline-flex items-center w-full px-4 py-2 text-sm text-left text-orange-500 hover:bg-orange-100"
                  >
                    <BiSolidUserDetail className="mr-1" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="inline-flex items-center w-full px-4 py-2 text-sm text-left text-orange-500 hover:bg-orange-100"
                  >
                    <CgLogOut className="mr-1" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              type="button"
              className="font-medium py-2 px-4 rounded-full hidden md:inline-flex items-center text-base"
            >
              <CgLogIn className="mr-2" />
              Login / Register
            </Button>
          )}
        </div>

        {/* Nav Menu Open Button */}
        <button
          type="button"
          className="text-black hover:text-orange-500 focus:outline-none md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>
      {/* // Mobile Menu */}
      {isOpen && (
        <div className="fixed font-semibold inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center md:hidden transition-all duration-300 ease-in-out">
          {/* Nav Menu Close Button */}
          <button
            type="button"
            className="absolute top-8 right-9 text-white hover:text-orange-500 focus:outline-none  md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <nav className="flex flex-col items-center justify-center space-y-6">
            {NavItems.map((navItem, index) => (
              <NavLink
                key={index}
                to={navItem.route}
                onClick={() => setIsOpen(!isOpen)}
                className={({ isActive }) => {
                  if (isActive) {
                    return 'text-2xl text-orange-500';
                  }
                  return 'text-2xl text-white hover:text-orange-500';
                }}
              >
                {navItem.name}
              </NavLink>
            ))}
            <Button
              variant="outline"
              type="button"
              className="font-semibold text-xl py-2 px-4 rounded-full inline-flex items-center mt-4"
            >
              <CgLogIn className="mr-2" />
              Login / Register
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}

export default MainNavbar;
