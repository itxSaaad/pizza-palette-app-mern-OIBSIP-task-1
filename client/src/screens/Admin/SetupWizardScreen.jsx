import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShieldAlt } from 'react-icons/fa';

import { getSetupStatus, bootstrapFirstAdmin } from '../../redux/asyncThunks/authThunks';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Message from '../../components/ui/Message';

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete = 'new-password',
  helperText,
  disabled = false,
  maxLength = 128,
  minLength,
}) {
  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="pr-20"
        helperText={helperText}
        maxLength={maxLength}
        minLength={minLength}
        required
        disabled={disabled}
      />
      <button
        type="button"
        className="absolute right-3 top-[34px] min-h-9 px-2 text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600 rounded"
        onClick={onToggle}
        disabled={disabled}
        aria-controls={name}
        aria-pressed={visible}
      >
        {visible ? 'Hide' : 'Show'}
        <span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}

// First-admin creation is a one-time bootstrap. Subsequent administrators are
// created by invitation from an authenticated administrator.
function SetupWizardScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [setupKeyVisible, setSetupKeyVisible] = useState(false);
  const [localError, setLocalError] = useState('');

  const {
    setupStatus,
    setupStatusError,
    setupStatusLoading,
    loading,
    bootstrapSuccess,
    bootstrapError,
  } = useSelector((state) => state.auth);
  const { adminUserInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getSetupStatus());
  }, [dispatch]);

  useEffect(() => {
    if (bootstrapSuccess && adminUserInfo) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [bootstrapSuccess, adminUserInfo, navigate]);

  useEffect(() => {
    if (bootstrapError) dispatch(getSetupStatus());
  }, [bootstrapError, dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setLocalError('Complete each required field to continue.');
      return;
    }
    if (setupStatus?.requiresSetupKey && !setupKey.trim()) {
      setLocalError('Enter the one-time setup key provided by the project owner.');
      return;
    }
    if (password.length < 12) {
      setLocalError('Choose a password with at least 12 characters.');
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setLocalError('Choose a password no longer than 72 UTF-8 bytes.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('The passwords do not match.');
      return;
    }

    dispatch(
      bootstrapFirstAdmin({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        ...(setupStatus?.requiresSetupKey ? { setupKey: setupKey.trim() } : {}),
      })
    );
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setLocalError('');
  };

  if (setupStatusLoading && !setupStatus) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div role="status" aria-live="polite" className="flex items-center gap-3 text-neutral-700">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600" />
          <span>Checking whether secure setup is available…</span>
        </div>
      </section>
    );
  }

  if (!setupStatus && setupStatusError) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <Card className="max-w-md w-full" padding="lg">
          <h1 className="font-display text-h3 text-neutral-900">Setup status unavailable</h1>
          <p className="text-neutral-600 mt-2 mb-5">
            We could not verify whether an administrator already exists. Try again before creating an account.
          </p>
          <Message variant="error">{setupStatusError}</Message>
          <Button
            type="button"
            className="w-full mt-5"
            onClick={() => dispatch(getSetupStatus())}
            loading={setupStatusLoading}
          >
            Retry setup check
          </Button>
        </Card>
      </section>
    );
  }

  if (setupStatus && !setupStatus.needsSetup) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-neutral-50 px-4 py-10">
        <Card className="max-w-md w-full text-center" padding="lg">
          <FaShieldAlt className="text-primary-500 text-5xl mx-auto mb-4" aria-hidden="true" />
          <h1 className="font-display text-h3 text-neutral-900 mb-3">Setup is complete</h1>
          <p className="text-neutral-600 mb-6">
            An administrator already exists. Sign in, or ask an administrator to invite another team member.
          </p>
          <Link to="/login" className="block">
            <Button variant="primary" fullWidth>Go to sign in</Button>
          </Link>
        </Card>
      </section>
    );
  }

  if (setupStatus && !setupStatus.setupEnabled) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-10">
        <Card className="max-w-lg w-full" padding="lg">
          <FaShieldAlt className="text-primary-500 text-4xl mb-4" aria-hidden="true" />
          <h1 className="font-display text-h3 text-neutral-900">Secure setup is not configured</h1>
          <p className="text-neutral-600 mt-3">
            The production database has no administrator yet. The project owner must add the private
            <code className="mx-1">INITIAL_ADMIN_SETUP_KEY</code> environment variable and redeploy before setup can continue.
          </p>
        </Card>
      </section>
    );
  }

  const passwordBytes = new TextEncoder().encode(password).length;
  const passwordLengthValid = password.length >= 12;
  const passwordByteLengthValid = password.length > 0 && passwordBytes <= 72;

  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-10">
      <Card className="max-w-lg w-full" padding="lg">
        <div className="text-center mb-6">
          <FaShieldAlt className="text-primary-500 text-5xl mx-auto mb-4" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary-700">One-time owner setup</p>
          <h1 className="font-display text-h3 text-neutral-900 mt-2">Create your administrator account</h1>
          <p className="text-neutral-600 mt-2">
            This account has full control of the store. Use an email account you own and a unique password.
          </p>
        </div>

        <div className="rounded-control border border-primary-200 bg-primary-50 p-4 mb-5 text-sm text-primary-900">
          Setup closes after the first administrator is created. Additional admins must be invited from inside the dashboard.
        </div>

        <div aria-live="polite" className="space-y-3">
          {(bootstrapError || localError) && (
            <Message variant="error">{localError || bootstrapError}</Message>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <Input
            label="Your name"
            name="name"
            type="text"
            value={name}
              onChange={(event) => {
                setName(event.target.value);
                setLocalError('');
              }}
            placeholder="Enter your name"
            autoComplete="name"
            maxLength={100}
            required
            disabled={loading}
          />

          <Input
            label="Owner email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setLocalError('');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
            disabled={loading}
          />

          {setupStatus.requiresSetupKey && (
            <PasswordField
              label="One-time setup key"
              name="setupKey"
              value={setupKey}
              onChange={(event) => {
                setSetupKey(event.target.value);
                setLocalError('');
              }}
              visible={setupKeyVisible}
              onToggle={() => setSetupKeyVisible((visible) => !visible)}
              autoComplete="off"
              maxLength={512}
              helperText="Use the private key configured for this deployment. It is sent only with this request."
              disabled={loading}
            />
          )}

          <PasswordField
            label="Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            visible={passwordVisible}
            onToggle={() => setPasswordVisible((visible) => !visible)}
            helperText="Use a unique passphrase. Passwords are hashed before they are stored."
            disabled={loading}
            maxLength={72}
            minLength={12}
          />

          <ul className="text-sm space-y-1 text-neutral-600" aria-live="polite">
            <li className={passwordLengthValid ? 'text-accent-green-800' : ''}>
              {passwordLengthValid ? '✓' : '•'} At least 12 characters
            </li>
            <li className={passwordByteLengthValid ? 'text-accent-green-800' : passwordBytes > 72 ? 'text-error-700' : ''}>
              {passwordByteLengthValid ? '✓' : '•'} No more than 72 UTF-8 bytes
            </li>
          </ul>

          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setLocalError('');
            }}
            visible={confirmVisible}
            onToggle={() => setConfirmVisible((visible) => !visible)}
            helperText={confirmPassword && confirmPassword !== password ? 'Passwords do not match yet.' : undefined}
            disabled={loading}
            maxLength={72}
            minLength={12}
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {loading ? 'Creating secure account…' : 'Create administrator'}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default SetupWizardScreen;
