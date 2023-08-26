import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

import { loginUser } from '../../../redux/asyncThunks/userThunks';

function UserLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userLoginError } = user;

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const forgetPwdHandler = () => {
    console.log('Forget Password');
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full py-20 px-14">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleLogin} className="w-full">
          <p className="text-center text-black text-xl leading-relaxed">
            Sign in to your Account
            <br />
            <span className="text-sm text-orange-500">
              You&apos;ve been Missed!
            </span>
          </p>

          {userLoginError && <Message>{userLoginError}</Message>}

          <div className="w-full my-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="flex justify-center items-center w-full">
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Enter Email Address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
                className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
              />
            </div>
          </div>
          <div className="flex justify-between items-center w-full mt-4">
            <div className="flex items-center">
              <Link
                to="/forget-pwd"
                onClick={forgetPwdHandler}
                className="text-sm text-orange-500 hover:text-orange-700"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-md">
            Login
          </Button>
        </form>
      )}
    </>
  );
}

export default UserLoginForm;
