import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { resetPassword } from '../../../../redux/asyncThunks/userThunks';
import { setPasswordResetOTP, setPasswordResetEmail } from '../../../../redux/slices/userSlice';

// Import Components
import Button from '../../Button';
import Input from '../../Input';
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
      const timer = setTimeout(() => {
        setCurrentStep('EmailForm');
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [userResetPasswordError, setCurrentStep]);

  useEffect(() => {
    if (userResetPasswordSuccess) {
      navigate('/login');
      const timer = setTimeout(() => {
        setCurrentStep('EmailForm');
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [userResetPasswordSuccess, setCurrentStep, navigate]);

  return (
    <>
      {loading ? (
        <Loader fullWidth />
      ) : (
        <form className="w-full" onSubmit={submitHandler}>
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Reset Password
            <br />
            <span className="text-sm text-primary-600">Enter New Password</span>
          </p>

          {userResetPasswordError && <Message>{userResetPasswordError}</Message>}

          <div className="w-full my-4">
            <Input
              name="password"
              type="password"
              value={password}
              placeholder="Enter New Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full my-4">
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="rounded-control">
            Verify OTP &amp; Reset Password
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
