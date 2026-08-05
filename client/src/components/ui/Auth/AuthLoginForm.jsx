import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { login } from '../../../redux/asyncThunks/authThunks';

// One login form/entry point for both customers and admin/manager accounts —
// the server resolves the account type from the email, so this component
// doesn't need to know or ask which kind of account is logging in.
function AuthLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const { loading, loginError } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full py-20 px-14">
          <Loader />
        </div>
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
              <Link to="/forget-pwd" className="text-sm text-primary-600 hover:text-primary-700">
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

export default AuthLoginForm;
