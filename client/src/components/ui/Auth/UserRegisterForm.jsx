import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

import { registerUser } from '../../../redux/asyncThunks/userThunks';

function UserRegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userRegisterError } = user;

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
        <div className="flex justify-center items-center w-full py-20 px-14">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleRegister} className="w-full">
          <p className="text-center text-black text-xl leading-relaxed">
            Create New Account
            <br />
            <span className="text-sm text-orange-500">
              It&apos;s free and only takes a minute
            </span>
          </p>

          {userRegisterError && <Message>{userRegisterError}</Message>}

          <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-2 my-2">
            <div className="w-full">
              <label htmlFor="name" className="sr-only">
                Name
              </label>

              <div className="flex justify-center items-center w-full">
                <input
                  type="name"
                  id="name"
                  value={name}
                  placeholder="Enter Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  required
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                />
              </div>
            </div>
            <div className="w-full">
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
            <div className="w-full">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>

              <div className="flex justify-center items-center w-full">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  required
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="phoneNumber" className="sr-only">
                Phone Number
              </label>

              <div className="flex justify-center items-center w-full">
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  placeholder="Enter Phone Number"
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="address" className="sr-only">
                Address
              </label>

              <div className="flex justify-center items-center w-full">
                <input
                  type="text"
                  id="address"
                  value={address}
                  placeholder="Enter Address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                />
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-md">
            Register
          </Button>
        </form>
      )}
    </>
  );
}

export default UserRegisterForm;
