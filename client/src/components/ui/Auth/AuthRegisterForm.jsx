import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';

import { registerUser } from '../../../redux/asyncThunks/userThunks';

// Customers are the only self-serve signup path — admin/manager accounts
// are invite-only (see AcceptInviteScreen), so this form no longer branches
// on role.
function AuthRegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useDispatch();

  const { loading, userRegisterError } = useSelector((state) => state.user);

  const handleRegister = (e) => {
    e.preventDefault();
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
  };

  return (
    <>
      {loading ? (
        <Loader fullWidth />
      ) : (
        <form onSubmit={handleRegister} className="w-full">
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Create New Account
            <br />
            <span className="text-sm text-primary-600">It&apos;s free and only takes a minute</span>
          </p>

          {userRegisterError && <Message>{userRegisterError}</Message>}

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 my-2">
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
          </div>

          <Button type="submit" variant="primary" fullWidth className="rounded-control">
            Register
          </Button>
        </form>
      )}
    </>
  );
}

export default AuthRegisterForm;
