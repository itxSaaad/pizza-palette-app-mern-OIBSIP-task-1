import PropTypes from 'prop-types';
import { FaMoneyCheckAlt, FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import Hooks
import { useModalTransition } from '../../../../hooks/useModalTransition';

// Import Components
import Button from '../../Button';
import Loader from '../../Loader';
import Modal from '../../Modal';
import CartItemList from './CartItemList';
import Message from '../../Message';

function CartModal({ onClose }) {
  const { visible, requestClose } = useModalTransition(onClose);
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { loading, cartItems, cartAddItemError, cartRemoveItemError } = cart;

  const handleCheckout = () => {
    requestClose();
    navigate('/checkout');
  };

  return (
    <Modal isOpen={visible} onClose={requestClose} title="Your Cart" size="md">
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
                <p className="text-lg font-semibold text-neutral-900">
                  Total Cost: $
                  {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </p>
                <p className="text-sm text-neutral-500">
                  *Shipping and taxes calculated at checkout
                </p>
                <hr className="my-2 border-neutral-200" />
                <p className="text-sm text-neutral-500">
                  By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
                </p>
                <p className="text-sm text-neutral-500">
                  You also agree that your order will be handled by our third party payment
                  processor.
                </p>
                <Button
                  variant="primary"
                  className="mt-4 rounded-pill"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <FaMoneyCheckAlt className="inline-flex mr-2" />
                  Checkout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FaShoppingCart className="text-4xl text-neutral-300 mb-2" />
              <p className="text-lg font-bold text-neutral-700">Your Cart is Empty!</p>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CartModal;
