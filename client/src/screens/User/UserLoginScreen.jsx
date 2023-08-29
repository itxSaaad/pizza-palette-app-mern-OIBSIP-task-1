import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import UserLoginForm from '../../components/ui/Auth/UserLoginForm';
import Logo from '/android-chrome-512x512.png';

function UserLoginScreen() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  useEffect(() => {
    if (userInfo || adminUserInfo) {
      navigate('/');
    }
  }, [navigate, userInfo, adminUserInfo]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pt-14 px-10 sm:px-16 bg-gradient-to-b from-orange-200 to-orange-100">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="hidden sm:block h-44 w-44"
          />
          <h1 className="text-4xl lg:text-5xl text-center md:text-left text-orange-500 font-semibold">
            <span className="text-orange-700">Login!</span> to get started.
          </h1>
        </div>

        <div className="bg-white flex flex-col justify-center items-center rounded-2xl shadow-lg p-6 md:w-1/2 lg:w-1/3">
          <UserLoginForm />
          <p className="text-center text-sm text-gray-400">
            No Account?{' '}
            <Link
              to="/register"
              className="underline text-orange-500 hover:text-orange-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default UserLoginScreen;
