import PropTypes from 'prop-types';
import { useState } from 'react';

// Import Components
import Button from '../../Button';

function OTPForm({ setCurrentStep }) {
  const [otp, setOtp] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('OTPForm', otp);
    setInterval(() => {
      setCurrentStep('PasswordForm');
    }, 1000);
  };

  return (
    <form className="w-full" onSubmit={submitHandler}>
      <p className="text-center text-black text-xl leading-relaxed">
        Reset Password
        <br />
        <span className="text-sm text-orange-500">
          Enter OTP sent to your Email Address
        </span>
      </p>
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
      <Button type="submit" variant="primary" className="w-full rounded-md">
        Proceed to Reset Password
      </Button>
    </form>
  );
}

OTPForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default OTPForm;
