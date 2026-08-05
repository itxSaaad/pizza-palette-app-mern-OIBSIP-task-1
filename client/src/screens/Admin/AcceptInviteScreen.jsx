import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import { acceptAdminInvite } from '../../redux/asyncThunks/inviteThunks';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

// Admin/manager accounts are invite-only — this is where an invited person
// sets their name/password and the account actually gets created.
function AcceptInviteScreen() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const token = searchParams.get('token');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { loading, acceptInviteSuccess, acceptInviteError } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    dispatch(acceptAdminInvite({ token, name, password, confirmPassword }));
  };

  if (!token) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaTimesCircle className="text-error-500 text-6xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Invalid Invite Link</h1>
          <p className="text-neutral-600 mb-6">
            This invite link is missing its token. Ask whoever invited you to send a new one.
          </p>
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </Card>
      </section>
    );
  }

  if (acceptInviteSuccess) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaCheckCircle className="text-accent-green-500 text-6xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Account Created!</h1>
          <p className="text-neutral-600 mb-6">
            Your account is ready and you&apos;re now logged in.
          </p>
          <Link to="/admin/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
      <Card className="max-w-md w-full" padding="lg">
        <div className="text-center mb-6">
          <FaUserPlus className="text-primary-500 text-5xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900">Accept Your Invite</h1>
          <p className="text-neutral-600 mt-2">Set a name and password to activate your account</p>
        </div>

        {(acceptInviteError || localError) && (
          <Message variant="error">{acceptInviteError || localError}</Message>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            disabled={loading}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? <Loader /> : 'Activate Account'}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default AcceptInviteScreen;
