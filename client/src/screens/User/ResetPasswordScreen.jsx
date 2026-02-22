import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Import Thunks
import { resetPassword } from '../../redux/asyncThunks/userThunks';

// Import Components
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import Button from '../../components/ui/Button';

function ResetPasswordScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const user = useSelector((state) => state.user);
  const { loading, userResetPasswordSuccess, userResetPasswordError } = user;

  useEffect(() => {
    if (userResetPasswordSuccess) {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [userResetPasswordSuccess, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    dispatch(resetPassword({ resetToken: token, password }));
  };

  if (!token) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            The password reset link is invalid or missing. Please request a new reset link.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary">Request New Link</Button>
          </Link>
        </div>
      </section>
    );
  }

  if (userResetPasswordSuccess) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <p className="text-sm text-gray-500 mb-4">Redirecting to login in 3 seconds...</p>
          <Link to="/login">
            <Button variant="primary">Go to Login Now</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <FaLock className="text-orange-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Reset Your Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        {(userResetPasswordError || localError) && (
          <Message variant="error">{userResetPasswordError || localError}</Message>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-orange-500 hover:text-orange-600 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordScreen;
