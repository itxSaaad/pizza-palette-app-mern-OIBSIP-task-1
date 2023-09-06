import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { forgotPassword } from '../../../../redux/asyncThunks/userThunks';
import { setPasswordResetEmail } from '../../../../redux/slices/userSlice';

// Import Components
import Button from '../../Button';
import Loader from '../../Loader';
import Message from '../../Message';

function EmailForm({ setCurrentStep }) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userForgotPasswordError, userForgotPasswordSuccess } = user;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setPasswordResetEmail(email));
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (userForgotPasswordSuccess) {
      setCurrentStep('OTPForm');
    }
  }, [userForgotPasswordSuccess, setCurrentStep]);
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
              Enter your Email Address to get OTP
            </span>
          </p>
          {userForgotPasswordError && (
            <Message>{userForgotPasswordError}</Message>
          )}
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
          <Button type="submit" variant="primary" className="w-full rounded-md">
            Send OTP
          </Button>
        </form>
      )}
    </>
  );
}

EmailForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default EmailForm;
