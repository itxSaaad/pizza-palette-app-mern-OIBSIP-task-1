import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import THunks
import {
  getUserDetails,
  verifyEmail,
} from '../../../redux/asyncThunks/userThunks';

// Import Components
import Button from '../Button';
import Loader from '../Loader';
import Message from '../Message';

function VerficationModal({ onClose }) {
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { loading, userDetails, userVerifyEmailError, userVerifyEmailSuccess } =
    user;

  const [email, setEmail] = useState(userDetails?.email || '');
  const [verificationCode, setVerificationCode] = useState('');

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(verifyEmail({ email, verificationCode }));
    console.log('VerficationModal', email, verificationCode);
  };

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails({}));
    }

    if (userVerifyEmailSuccess) {
      dispatch(getUserDetails({}));
      setModalVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }

    if (onClose) {
      setModalVisible(true);
    }
  }, [dispatch, onClose, userVerifyEmailSuccess, userDetails]);
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-10 bg-gray-800 bg-opacity-30 p-4 backdrop-filter backdrop-blur-sm transition-opacity duration-200 ${
        modalVisible ? 'opacity-100' : 'opacity-0 delay-150'
      }`}
      onClick={handleModalClose}
    >
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-2/3 md:w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-orange-500 font-bold mb-4">
            Verfiy Your Email
          </h2>
          <button
            className="text-red-500 hover:text-red-600 border-2 border-red-500 hover:border-red-600 rounded-full p-1"
            onClick={handleModalClose}
          >
            <FaTimes />
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <form className="w-full" onSubmit={submitHandler}>
            <p className="text-center text-black text-xl leading-relaxed">
              Please verify your email address to continue
            </p>
            {userVerifyEmailError && <Message>{userVerifyEmailError}</Message>}
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

            <div className="w-full my-4">
              <label htmlFor="verificationCode" className="sr-only">
                Verification Code
              </label>

              <div className="flex justify-center items-center w-full">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  min="6"
                  max="6"
                  placeholder="Enter Verification Code"
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                  required
                  className="w-full text-orange-600 bg-orange-100 placeholder-orange-300 rounded-md p-4 pr-12 text-sm shadow-sm"
                />
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-md"
            >
              Verify
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

VerficationModal.propTypes = {
  onClose: PropTypes.func,
};

export default VerficationModal;
