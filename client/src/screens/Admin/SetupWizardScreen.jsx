import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShieldAlt } from 'react-icons/fa';

import { getSetupStatus, bootstrapFirstAdmin } from '../../redux/asyncThunks/authThunks';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Message from '../../components/ui/Message';

// One-time first-admin bootstrap. Every admin/manager created after this one
// must go through the invite flow — this screen locks itself out once an
// admin already exists.
function SetupWizardScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { setupStatus, loading, bootstrapSuccess, bootstrapError } = useSelector(
    (state) => state.auth
  );
  const { adminUserInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getSetupStatus());
  }, [dispatch]);

  useEffect(() => {
    if (bootstrapSuccess && adminUserInfo) {
      navigate('/admin/dashboard');
    }
  }, [bootstrapSuccess, adminUserInfo, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    dispatch(bootstrapFirstAdmin({ name, email, password, confirmPassword }));
  };

  if (setupStatus && !setupStatus.needsSetup) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <h1 className="font-display text-h3 text-neutral-900 mb-4">Setup Already Complete</h1>
          <p className="text-neutral-600 mb-6">
            An admin account already exists. New admin/manager accounts are now invite-only.
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
      <Card className="max-w-md w-full" padding="lg">
        <div className="text-center mb-6">
          <FaShieldAlt className="text-primary-500 text-5xl mx-auto mb-4" />
          <h1 className="font-display text-h3 text-neutral-900">Initial Setup</h1>
          <p className="text-neutral-600 mt-2">Create the first admin account for this store</p>
        </div>

        {(bootstrapError || localError) && (
          <Message variant="error">{bootstrapError || localError}</Message>
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
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            {loading ? <Loader /> : 'Create Admin Account'}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default SetupWizardScreen;
