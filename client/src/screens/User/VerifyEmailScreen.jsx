import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Import Thunks
import { verifyEmail } from '../../redux/asyncThunks/userThunks';

// Import Components
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

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
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [userVerifyEmailSuccess, navigate]);

  if (!token) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaTimesCircle className="text-error-500 text-6xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Invalid Verification Link</h1>
          <p className="text-neutral-600 mb-6">
            The verification link is invalid or missing. Please check your email and try again.
          </p>
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
      <Card className="max-w-md w-full text-center" padding="lg">
        {loading ? (
          <>
            <Loader />
            <h1 className="font-display text-h3 text-neutral-900 mt-4">Verifying Your Email</h1>
            <p className="text-neutral-600 mt-2">Please wait while we verify your account...</p>
          </>
        ) : userVerifyEmailSuccess ? (
          <>
            <FaCheckCircle className="text-accent-green-500 text-6xl mx-auto mb-4" />
            <h1 className="font-display text-h3 text-neutral-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-neutral-600 mb-6">
              Your email has been verified. You can now log in to your account.
            </p>
            <p className="text-sm text-neutral-500">Redirecting to login in 3 seconds...</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button variant="primary">Go to Login Now</Button>
            </Link>
          </>
        ) : userVerifyEmailError ? (
          <>
            <FaTimesCircle className="text-error-500 text-6xl mx-auto mb-4" />
            <h1 className="font-display text-h3 text-neutral-900 mb-4">Verification Failed</h1>
            <Message variant="error">{userVerifyEmailError}</Message>
            <p className="text-neutral-600 mt-4 mb-6">
              The verification link may have expired or is invalid. Please try again or contact
              support.
            </p>
            <Link to="/login">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </>
        ) : null}
      </Card>
    </section>
  );
}

export default VerifyEmailScreen;
