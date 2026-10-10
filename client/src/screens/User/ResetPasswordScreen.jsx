import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Import Thunks
import { resetPassword } from '../../redux/asyncThunks/authThunks';

// Import Components
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

function ResetPasswordScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { loading, resetPasswordSuccess, resetPasswordError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (resetPasswordSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resetPasswordSuccess, navigate]);

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

    dispatch(
      resetPassword({
        email,
        resetToken: token,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      })
    );
  };

  if (!token || !email) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaTimesCircle className="text-error-500 text-6xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Invalid Reset Link</h1>
          <p className="text-neutral-600 mb-6">
            The password reset link is invalid or missing. Please request a new reset link.
          </p>
          <Link to="/forget-pwd">
            <Button variant="primary">Request New Link</Button>
          </Link>
        </Card>
      </section>
    );
  }

  if (resetPasswordSuccess) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaCheckCircle className="text-accent-green-500 text-6xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Password Reset Successful!</h1>
          <p className="text-neutral-600 mb-6">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <p className="text-sm text-neutral-500 mb-4">Redirecting to login in 3 seconds...</p>
          <Link to="/login">
            <Button variant="primary">Go to Login Now</Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
      <Card className="max-w-md w-full" padding="lg">
        <div className="text-center mb-6">
          <FaLock className="text-primary-500 text-5xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900">Reset Your Password</h1>
          <p className="text-neutral-600 mt-2">Enter your new password below</p>
        </div>

        {(resetPasswordError || localError) && (
          <Message variant="error">{resetPasswordError || localError}</Message>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={loading}
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={loading}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? <Loader /> : 'Reset Password'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-primary-600 hover:text-primary-700 text-sm">
            Back to Login
          </Link>
        </div>
      </Card>
    </section>
  );
}

export default ResetPasswordScreen;
