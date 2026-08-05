import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import AuthRegisterForm from '../../components/ui/Auth/AuthRegisterForm';
import Card from '../../components/ui/Card';
import Logo from '/android-chrome-512x512.png';

function AdminRegisterScreen() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const { userInfo } = user;

  const admin = useSelector((state) => state.admin);
  const { adminUserInfo } = admin;

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (adminUserInfo) {
      navigate('/admin/dashboard');
    }
  }, [navigate, adminUserInfo]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center pb-4 sm:pb-0 px-10 sm:px-16 bg-gradient-to-b from-primary-200 to-neutral-50">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img
            src={Logo}
            alt="Pizza Palette Logo"
            className="hidden sm:block h-44 w-44"
          />
          <h1 className="font-display text-h1 text-center md:text-left text-primary-600">
            <span className="text-primary-700">Register Now!</span> to be part of
            our Team
          </h1>
        </div>

        <Card className="flex flex-col justify-center items-center md:w-1/2 lg:w-1/3" padding="lg">
          <AuthRegisterForm role="admin" />
          <p className="text-center text-sm text-neutral-500 mt-2">
            Already have Account?{' '}
            <Link
              to="/admin/login"
              className="underline text-primary-600 hover:text-primary-700"
            >
              Sign in Here
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}

export default AdminRegisterScreen;
