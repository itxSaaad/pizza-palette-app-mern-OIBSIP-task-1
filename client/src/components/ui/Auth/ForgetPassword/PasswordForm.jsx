import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { resetPassword } from '../../../../redux/asyncThunks/userThunks';
import {
  setPasswordResetOTP,
  setPasswordResetEmail,
} from '../../../../redux/slices/userSlice';

// Import Components
import Button from '../../Button';
import Loader from '../../Loader';
import Message from '../../Message';

function PasswordForm({ setCurrentStep }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const {
    loading,
    userPasswordResetOTP,
    userPasswordResetEmail,
    userResetPasswordError,
    userResetPasswordSuccess,
  } = user;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      resetPassword({
        email: userPasswordResetEmail,
        resetToken: userPasswordResetOTP,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      })
    ).then(() => {
      dispatch(setPasswordResetOTP(''));
      dispatch(setPasswordResetEmail(''));
    });
  };

  useEffect(() => {
    if (userResetPasswordError) {
      setInterval(() => {
        setCurrentStep('EmailForm');
      }, 1000);
    }
  }, [userResetPasswordError, setCurrentStep]);

  useEffect(() => {
    if (userResetPasswordSuccess) {
      navigate('/login');
      setInterval(() => {
        setCurrentStep('EmailForm');
      }, 1000);
    }
  }, [userResetPasswordSuccess, setCurrentStep, navigate]);

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <form className="w-full" onSubmit={submitHandler}>
          <p className="text-center text-black text-xl leading-relaxed">
            Reset Password
            <br />
            <span className="text-sm text-orange-500">Enter New Password</span>
          </p>

          {userResetPasswordError && (
            <Message>{userResetPasswordError}</Message>
          )}

          <div className="w-full my-4">
            <label htmlFor="password" className="sr-only">
              New Password
            </label>

            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter New Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
                className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
              />
            </div>
          </div>
          <div className="w-full my-4">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm New Password
            </label>

            <div className="flex justify-center items-center w-full">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm New Password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
                className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full rounded-md">
            Verify OTP & Reset Password
          </Button>
        </form>
      )}
    </>
  );
}

PasswordForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PasswordForm;
