import { useEffect, useRef, useState } from 'react';
import { CgLogIn } from 'react-icons/cg';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

// Import Actions
import { clearAdminUserData } from '../../redux/slices/adminSlice';
import { clearCartData } from '../../redux/slices/cartSlice';
import { clearPizzaData } from '../../redux/slices/pizzaSlice';
import { clearUserData } from '../../redux/slices/userSlice';
import { clearOrderData } from '../../redux/slices/orderSlice';
import { clearInventoryData } from '../../redux/slices/inventorySlice';

// Import Images
import Logo from '/android-chrome-192x192.png';

// Import Components
import Button from '../ui/Button';
import CartButton from '../ui/Cart/CartButton';
import CartModal from '../ui/Cart/CartModal/CartModal';
import ProfileBtnAndDropOnNav from '../ui/Profile/ProfileBtnAndDropOnNav';

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropIsOpen, setDropIsOpen] = useState(false);
  const [cartIsOpen, setCartIsOpen] = useState(false);

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
      route: '/menu',
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

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(clearUserData());
    dispatch(clearPizzaData());
    dispatch(clearAdminUserData());
    dispatch(clearCartData());
    dispatch(clearOrderData());
    dispatch(clearInventoryData());
    setDropIsOpen(!dropIsOpen);
  };

  return (
    <>
      <nav className="fixed bg-white w-screen flex flex-row items-center justify-between px-6 sm:px-16 shadow-sm space-x-3">
        <NavLink
          href="/"
          className="flex flex-row justify-center items-center text-black font-bold text-lg sm:text-3xl"
        >
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="h-10 w-10 sm:h-14 sm:w-14 mr-2"
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
          <CartButton onClick={() => setCartIsOpen(!cartIsOpen)}>
            {cartItems ? cartItems.length : 0}
          </CartButton>

          {userInfo || adminUserInfo ? (
            <ProfileBtnAndDropOnNav
              dropIsOpen={dropIsOpen}
              setDropIsOpen={setDropIsOpen}
              dropdownRef={dropdownRef}
              logoutHandler={logoutHandler}
            />
          ) : (
            <Link to={'/login'}>
              <Button
                variant="primary"
                type="button"
                className="font-medium py-2 px-4 rounded-full hidden md:inline-flex items-center text-base"
              >
                <CgLogIn className="mr-2" />
                Login / Register
              </Button>
            </Link>
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
            {!userInfo && !adminUserInfo && (
              <Link to="/login">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="font-semibold text-xl py-2 px-4 rounded-full inline-flex items-center mt-4"
                >
                  <CgLogIn className="mr-2" />
                  Login / Register
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
      {cartIsOpen && (
        <CartModal
          onClose={() => {
            setCartIsOpen(false);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}

export default MainNavbar;
