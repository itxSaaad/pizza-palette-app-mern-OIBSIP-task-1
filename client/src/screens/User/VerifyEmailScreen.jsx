import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Import Thunks
import { verifyEmail } from '../../redux/asyncThunks/userThunks';

// Import Components
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';
import Button from '../../components/ui/Button';

function VerifyEmailScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  const token = searchParams.get('token');

  const user = useSelector((state) => state.user);
  const { loading, userVerifyEmailSuccess, userVerifyEmailError } = user;

  useEffect(() => {
    if (token && !verificationAttempted) {
      setVerificationAttempted(true);
      dispatch(verifyEmail({ verificationCode: token }));
    } else if (!token) {
      setVerificationAttempted(true);
    }
  }, [token, dispatch, verificationAttempted]);

  useEffect(() => {
    if (userVerifyEmailSuccess) {
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  }, [userVerifyEmailSuccess, navigate]);

  if (!token) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Verification Link</h1>
          <p className="text-gray-600 mb-6">
            The verification link is invalid or missing. Please check your email and try again.
          </p>
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-orange-200 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {loading ? (
          <>
            <Loader />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Verifying Your Email</h1>
            <p className="text-gray-600 mt-2">Please wait while we verify your account...</p>
          </>
        ) : userVerifyEmailSuccess ? (
          <>
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verified Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your email has been verified. You can now log in to your account.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button variant="primary">Go to Login Now</Button>
            </Link>
          </>
        ) : userVerifyEmailError ? (
          <>
            <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h1>
            <Message variant="error">{userVerifyEmailError}</Message>
            <p className="text-gray-600 mt-4 mb-6">
              The verification link may have expired or is invalid. Please try again or contact support.
            </p>
            <Link to="/login">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default VerifyEmailScreen;
