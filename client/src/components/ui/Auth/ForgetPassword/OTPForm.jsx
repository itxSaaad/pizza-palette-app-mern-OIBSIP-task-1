import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { setPasswordResetOTP } from '../../../../redux/slices/userSlice';
import { forgotPassword } from '../../../../redux/asyncThunks/userThunks';

// Import Components
import Button from '../../Button';
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
    setInterval(() => {
      setCurrentStep('PasswordForm');
    }, 1000);
  };

  useEffect(() => {
    if (userForgotPasswordError) {
      setInterval(() => {
        setCurrentStep('EmailForm');
      }, 1000);
    }
  }, [userForgotPasswordError, setCurrentStep]);

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
            <span className="text-sm text-orange-500">
              Enter OTP sent to your Email Address
            </span>
          </p>
          {userForgotPasswordError && (
            <Message>{userForgotPasswordError}</Message>
          )}

          <div className="w-full my-4">
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>

            <div className="flex justify-center items-center w-full">
              <input
                type="text"
                id="otp"
                value={otp}
                placeholder="Enter OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                required
                className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <p className="text-sm text-gray-400">
              Didn&apos;t receive OTP?{' '}
              <span
                className="text-orange-600 cursor-pointer"
                onClick={() => {
                  dispatch(
                    forgotPassword({
                      email: userPasswordResetEmail,
                    })
                  );
                }}
              >
                Resend OTP
              </span>
            </p>
          </div>
          <Button type="submit" variant="primary" className="w-full rounded-md">
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
