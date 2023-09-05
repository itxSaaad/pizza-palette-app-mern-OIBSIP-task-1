import { useState } from 'react';
import PropTypes from 'prop-types';

// Import Components
import Button from '../../Button';

function EmailForm({ setCurrentStep }) {
  const [email, setEmail] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('EmailForm', email);
    setCurrentStep('OTPForm');
  };
  return (
    <form className="w-full" onSubmit={submitHandler}>
      <p className="text-center text-black text-xl leading-relaxed">
        Reset Password
        <br />
        <span className="text-sm text-orange-500">
          Enter your Email Address to get OTP
        </span>
      </p>
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
  );
}

EmailForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default EmailForm;
