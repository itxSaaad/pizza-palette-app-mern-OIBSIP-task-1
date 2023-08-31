import PropTypes from 'prop-types';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

// Import Components
import Button from '../../Button';

function CartItemList({ cartItems, handleQuantityChange, removeItemFromCart }) {
  return (
    <>
      {cartItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 border-b border-b-orange-300 pb-2"
        >
          <img src={item.imageSrc} alt={item.name} className="w-12 h-12" />
          <div className="flex-grow">
            <p className="font-semibold">{item.name}</p>
            <p>Price: ${item.price}</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                className="text-red-500"
              >
                <FaMinus />
              </button>
              <p>Qty: {item.quantity}</p>
              <button
                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                className="text-green-500"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <Button
            variant="danger"
            className="rounded-full p-1"
            onClick={removeItemFromCart(item.id)}
          >
            <FaTrash />
          </Button>

          <p>Total: ${item.price * item.quantity}</p>
        </div>
      ))}
    </>
  );
}

CartItemList.propTypes = {
  cartItems: PropTypes.array.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  removeItemFromCart: PropTypes.func.isRequired,
};

export default CartItemList;
