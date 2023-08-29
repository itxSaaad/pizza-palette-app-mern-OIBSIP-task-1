import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import UserRegisterForm from '../../components/ui/Auth/UserRegisterForm';
import Logo from '/android-chrome-512x512.png';

function UserRegisterScreen() {
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
    <section className="min-h-screen flex flex-col justify-center items-center pt-14 sm:pt-28 pb-4 px-10 sm:px-16 bg-gradient-to-b from-orange-200 to-orange-100">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="hidden sm:block h-44 w-44"
          />
          <h1 className="text-4xl lg:text-5xl text-center md:text-left text-orange-500 font-semibold">
            <span className="text-orange-700">Register Now!</span> to enjoy our
            services.
          </h1>
        </div>

        <div className="bg-white flex flex-col justify-center items-center rounded-2xl shadow-lg p-6 md:w-1/2">
          <UserRegisterForm />
          <p className="text-center text-sm text-gray-400">
            Already have Account?{' '}
            <Link
              to="/login"
              className="underline text-orange-500 hover:text-orange-700"
            >
              Sign in Here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default UserRegisterScreen;
