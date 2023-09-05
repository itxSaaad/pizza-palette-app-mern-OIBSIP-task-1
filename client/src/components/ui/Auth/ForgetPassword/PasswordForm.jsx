import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Components
import Button from '../../Button';

function PasswordForm({ setCurrentStep }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log('PasswordForm', password, confirmPassword);
    setInterval(() => {
      navigate('/login');
      setCurrentStep('EmailForm');
    }, 1000);
  };

  return (
    <form className="w-full" onSubmit={submitHandler}>
      <p className="text-center text-black text-xl leading-relaxed">
        Reset Password
        <br />
        <span className="text-sm text-orange-500">Enter New Password</span>
      </p>
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
        Verify OTP
      </Button>
    </form>
  );
}

PasswordForm.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PasswordForm;
