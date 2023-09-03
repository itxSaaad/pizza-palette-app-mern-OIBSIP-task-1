import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaMoneyCheckAlt, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Components
import Button from '../../Button';
import Loader from '../../Loader';
import CartItemList from './CartItemList';
import Message from '../../Message';

function CartModal({ onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { loading, cartItems, cartAddItemError, cartRemoveItemError } = cart;

  const handleModalClose = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCheckout = () => {
    setModalVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
    navigate('/checkout');
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
        {loading ? (
          <Loader />
        ) : (
          <>
            {(cartAddItemError || cartRemoveItemError) && (
              <Message>{cartAddItemError || cartRemoveItemError}</Message>
            )}
            {cartItems && cartItems.length > 0 ? (
              <div className="space-y-4">
                <CartItemList />
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    Total Cost: $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-sm text-orange-400">
                    *Shipping and taxes calculated at checkout
                  </p>
                  <hr className="my-2" />
                  <p className="text-sm text-orange-400">
                    By proceeding to checkout, you agree to our Terms of Service
                    and Privacy Policy.
                  </p>
                  <p className="text-sm text-orange-400">
                    You also agree that your order will be handled by our third
                    party payment processor.
                  </p>
                  <Button
                    variant="primary"
                    className="mt-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <FaMoneyCheckAlt className="inline-flex mr-2" />
                    Checkout
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-lg font-bold">Your Cart is Empty!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CartModal;
