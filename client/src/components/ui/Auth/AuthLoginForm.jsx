import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { loginUser } from '../../../redux/asyncThunks/userThunks';
import { loginAdmin } from '../../../redux/asyncThunks/adminThunks';

function AuthLoginForm({ role, forgotPasswordTo = '/forget-pwd' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);
  const adminState = useSelector((state) => state.admin);

  const loading = role === 'admin' ? adminState.loading : userState.loading;
  const loginError = role === 'admin' ? adminState.adminUserLoginError : userState.userLoginError;

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      dispatch(loginAdmin({ email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <>
      {loading ? (
        <Loader fullWidth />
      ) : (
        <form onSubmit={handleLogin} className="w-full">
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Sign in to your Account
            <br />
            <span className="text-sm text-primary-600">You&apos;ve been Missed!</span>
          </p>

          {loginError && <Message>{loginError}</Message>}

          <div className="w-full my-4">
            <Input
              name="email"
              type="email"
              value={email}
              placeholder="Enter Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <Input
              name="password"
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center w-full mt-4">
            <div className="flex items-center">
              <Link
                to={forgotPasswordTo}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="rounded-control mt-4">
            Login
          </Button>
        </form>
      )}
    </>
  );
}

AuthLoginForm.propTypes = {
  role: PropTypes.oneOf(['user', 'admin']).isRequired,
  forgotPasswordTo: PropTypes.string,
};

export default AuthLoginForm;
