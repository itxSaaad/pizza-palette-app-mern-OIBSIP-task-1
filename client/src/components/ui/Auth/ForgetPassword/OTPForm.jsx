import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { setPasswordResetOTP } from '../../../../redux/slices/userSlice';
import { forgotPassword } from '../../../../redux/asyncThunks/userThunks';

// Import Components
import Button from '../../Button';
import Input from '../../Input';
import Loader from '../../Loader';
import Message from '../../Message';

function OTPForm({ setCurrentStep }) {
  const [otp, setOtp] = useState('');

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userPasswordResetEmail, userForgotPasswordError } = user;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setPasswordResetOTP(otp));
    setTimeout(() => {
      setCurrentStep('PasswordForm');
    }, 1000);
  };

  useEffect(() => {
    if (userForgotPasswordError) {
      const timer = setTimeout(() => {
        setCurrentStep('EmailForm');
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [userForgotPasswordError, setCurrentStep]);

  return (
    <>
      {loading ? (
        <Loader fullWidth />
      ) : (
        <form className="w-full" onSubmit={submitHandler}>
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Reset Password
            <br />
            <span className="text-sm text-primary-600">Enter OTP sent to your Email Address</span>
          </p>
          {userForgotPasswordError && <Message>{userForgotPasswordError}</Message>}

          <div className="w-full my-4">
            <Input
              name="otp"
              type="text"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="w-full flex justify-center items-center">
            <p className="text-sm text-neutral-500">
              Didn&apos;t receive OTP?{' '}
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 underline"
                onClick={() => {
                  dispatch(
                    forgotPassword({
                      email: userPasswordResetEmail,
                    })
                  );
                }}
              >
                Resend OTP
              </button>
            </p>
          </div>
          <Button type="submit" variant="primary" fullWidth className="rounded-control">
            Proceed to Reset Password
          </Button>
        </form>
      )}
    </>
  );
}

OTPForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default OTPForm;
