import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { getUserDetails, verifyEmail } from '../../../redux/asyncThunks/userThunks';

// Import Hooks
import { useModalTransition } from '../../../hooks/useModalTransition';

// Import Components
import Button from '../Button';
import Input from '../Input';
import Loader from '../Loader';
import Message from '../Message';
import Modal from '../Modal';

function VerificationModal({ onClose }) {
  const { visible, requestClose } = useModalTransition(onClose);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userDetails, userVerifyEmailError, userVerifyEmailSuccess } = user;

  const [email, setEmail] = useState(userDetails?.email || '');
  const [verificationCode, setVerificationCode] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyEmail({ email, verificationCode }));
  };

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails({}));
    }

    if (userVerifyEmailSuccess) {
      dispatch(getUserDetails({}));
      requestClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userVerifyEmailSuccess, userDetails]);

  useEffect(() => {
    if (userDetails?.email) {
      setEmail(userDetails.email);
    }
  }, [userDetails]);

  return (
    <Modal isOpen={visible} onClose={requestClose} title="Verify Your Email" size="sm">
      {loading ? (
        <Loader />
      ) : (
        <form className="w-full" onSubmit={submitHandler}>
          <p className="text-center text-neutral-900 text-xl leading-relaxed">
            Please verify your email address to continue
          </p>
          {userVerifyEmailError && <Message>{userVerifyEmailError}</Message>}
          <div className="w-full my-4">
            <Input
              name="email"
              type="email"
              value={email}
              placeholder="Enter Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full my-4">
            <Input
              name="verificationCode"
              type="text"
              value={verificationCode}
              placeholder="Enter Verification Code"
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" variant="primary" fullWidth className="rounded-control">
            Verify
          </Button>
        </form>
      )}
    </Modal>
  );
}

VerificationModal.propTypes = {
  onClose: PropTypes.func,
};

export default VerificationModal;
