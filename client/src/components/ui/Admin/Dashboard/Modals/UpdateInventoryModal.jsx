import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaMoneyCheckAlt, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Components
import Button from '../../../Button';
import Loader from '../../../Loader';

function UpdateInventoryModal({ onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleUpdateInventory = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (onClose) {
      setModalVisible(true);
    }
  }, [onClose]);
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
          <h2 className="w-full text-xl text-orange-500 font-bold border-b border-b-orange-400">
            Add a New Stock
          </h2>
          <button
            className="text-red-500 border-2 border-red-500 hover:bg-red-600 hover:text-white rounded-full p-1 ml-10"
            onClick={handleModalClose}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
}

UpdateInventoryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UpdateInventoryModal;
