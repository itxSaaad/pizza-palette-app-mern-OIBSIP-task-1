import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  FaMinus,
  FaMoneyCheckAlt,
  FaPlus,
  FaShoppingCart,
  FaTimes,
} from 'react-icons/fa';

import Button from '../../Button';

function CartModal({ onClose, cartDetails }) {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (onClose) {
      setModalVisible(true);
    }
  }, [onClose]);

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleQuantityChange = (item, newQuantity) => {
    const updatedCart = cartDetails.map((cartItem) => {
      if (cartItem.name === item.name) {
        return {
          ...cartItem,
          quantity: newQuantity,
        };
      }
      return cartItem;
    });
    console.log(updatedCart);
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    cartDetails.forEach((item) => {
      totalCost += item.price * item.quantity;
    });
    return totalCost;
  };

  const handleCheckout = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

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
            <FaShoppingCart className="inline-flex mr-2" />
            Your Cart
          </h2>
          <button
            className="text-red-500 hover:text-red-600 border-2 border-red-500 hover:border-red-600 rounded-full p-1"
            onClick={handleModalClose}
          >
            <FaTimes />
          </button>
        </div>
        {cartDetails.length > 0 ? (
          <div className="space-y-4">
            {cartDetails.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 border-b border-b-orange-300 pb-2"
              >
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  className="w-12 h-12"
                />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p>Price: ${item.price}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="text-red-500"
                    >
                      <FaMinus />
                    </button>
                    <p>Qty: {item.quantity}</p>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="text-green-500"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <p>Total: ${item.price * item.quantity}</p>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-semibold">
                Total Cost: ${calculateTotalCost()}
              </p>
              <p className="text-sm text-orange-400">
                *Shipping and taxes calculated at checkout
              </p>
              <hr className="my-2" />
              <p className="text-sm text-orange-400">
                By proceeding to checkout, you agree to our Terms of Service and
                Privacy Policy.
              </p>
              <p className="text-sm text-orange-400">
                You also agree that your order will be handled by our third
                party payment processor.
              </p>
              <Button
                variant="primary"
                className="mt-4 rounded-full"
                onClick={handleCheckout}
              >
                <FaMoneyCheckAlt className="inline-flex mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-lg font-bold">Your cart is empty</p>
        )}
      </div>
    </div>
  );
}

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  cartDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CartModal;
