import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import AuthLoginForm from '../components/ui/Auth/AuthLoginForm';
import Card from '../components/ui/Card';
import Logo from '/android-chrome-512x512.png';

// A single login entry point for both customers and admin/manager accounts —
// the server resolves the account type, so there's no separate "staff login".
function LoginScreen() {
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const { adminUserInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    if (adminUserInfo) {
      navigate('/admin/dashboard');
    } else if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo, adminUserInfo]);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-10 sm:px-16 bg-gradient-to-b from-primary-100 to-neutral-50">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-6">
        <div className="flex flex-row justify-center items-center p-4 md:p-6 md:w-1/2">
          <img src={Logo} alt="Pizza Palette Logo" className="hidden sm:block h-44 w-44" />
          <h1 className="font-display text-h1 text-center md:text-left text-primary-600">
            <span className="text-primary-700">Login!</span> to get started.
          </h1>
        </div>

        <Card className="flex flex-col justify-center items-center md:w-1/2 lg:w-1/3" padding="lg">
          <AuthLoginForm />
          <p className="text-center text-sm text-neutral-500 mt-2">
            No Account?{' '}
            <Link to="/register" className="underline text-primary-600 hover:text-primary-700">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
}

export default LoginScreen;
