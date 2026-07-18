import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { registerUser } from '../../../redux/asyncThunks/userThunks';
import { registerAdmin } from '../../../redux/asyncThunks/adminThunks';

function AuthRegisterForm({ role }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);
  const adminState = useSelector((state) => state.admin);

  const loading = role === 'admin' ? adminState.loading : userState.loading;
  const registerError =
    role === 'admin' ? adminState.adminUserRegisterError : userState.userRegisterError;

  const handleRegister = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      dispatch(registerAdmin({ name, email, password, confirmPassword }));
    } else {
      dispatch(
        registerUser({
          name,
          email,
          password,
          confirmPassword,
          phoneNumber,
          address,
        })
      );
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full py-20 px-14">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleRegister} className="w-full">
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Create New Account
            <br />
            <span className="text-sm text-primary-600">It&apos;s free and only takes a minute</span>
          </p>

          {registerError && <Message>{registerError}</Message>}

          <div
            className={`w-full grid grid-cols-1 gap-4 my-2 ${
              role === 'user' ? 'lg:grid-cols-2' : ''
            }`}
          >
            <Input
              name="name"
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              name="email"
              type="email"
              value={email}
              placeholder="Enter Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              name="password"
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {role === 'user' && (
              <>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  placeholder="Enter Phone Number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input
                  name="address"
                  type="text"
                  value={address}
                  placeholder="Enter Address"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth className="rounded-control">
            Register
          </Button>
        </form>
      )}
    </>
  );
}

AuthRegisterForm.propTypes = {
  role: PropTypes.oneOf(['user', 'admin']).isRequired,
};

export default AuthRegisterForm;
