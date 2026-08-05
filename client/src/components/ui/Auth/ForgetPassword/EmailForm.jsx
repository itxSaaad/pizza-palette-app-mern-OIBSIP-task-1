import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { forgotPassword } from '../../../../redux/asyncThunks/authThunks';
import { setPasswordResetEmail } from '../../../../redux/slices/authSlice';

// Import Components
import Button from '../../Button';
import Input from '../../Input';
import Loader from '../../Loader';
import Message from '../../Message';

function EmailForm({ setCurrentStep }) {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const { loading, forgotPasswordError, forgotPasswordSuccess } = useSelector(
    (state) => state.auth
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(setPasswordResetEmail(email));
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (forgotPasswordSuccess) {
      setCurrentStep('OTPForm');
    }
  }, [forgotPasswordSuccess, setCurrentStep]);

  return (
    <>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <form className="w-full" onSubmit={submitHandler}>
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Reset Password
            <br />
            <span className="text-sm text-primary-600">Enter your Email Address to get OTP</span>
          </p>
          {forgotPasswordError && <Message>{forgotPasswordError}</Message>}
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
          <Button type="submit" variant="primary" fullWidth className="rounded-control">
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
