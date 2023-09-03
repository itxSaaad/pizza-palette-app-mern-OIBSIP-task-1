import { useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { addToCart, removeFromCart } from '../../../../redux/slices/cartSlice';

// Import Components
import Button from '../../Button';

function CartItemList() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // State to manage item quantities
  const [itemQuantities, setItemQuantities] = useState({});

  // Function to update item quantity
  const updateQuantity = (itemId, quantity) => {
    setItemQuantities({
      ...itemQuantities,
      [itemId]: quantity,
    });
  };

  return (
    <>
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex items-center space-x-4 border-b border-b-orange-300 pb-2"
        >
          <img src={item.imageUrl} alt={item.name} className="w-12 h-12" />
          <div className="flex-grow">
            <p className="font-semibold">{item.name}</p>
            <p>
              Price: ${item.price} | Size:{' '}
              {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
            </p>
            <div className="flex items-center space-x-2">
              <button
                className="text-red-500"
                onClick={() => {
                  const newQuantity =
                    (itemQuantities[item._id] || item.qty) - 1;
                  if (newQuantity >= 1) {
                    dispatch(addToCart({ id: item._id, qty: newQuantity }));
                    updateQuantity(item._id, newQuantity);
                  }
                }}
              >
                <FaMinus />
              </button>
              <p>Qty: {item.qty}</p>
              <button
                className="text-green-500"
                onClick={() => {
                  const newQuantity =
                    (itemQuantities[item._id] || item.qty) + 1;
                  if (newQuantity <= 10) {
                    dispatch(addToCart({ id: item._id, qty: newQuantity }));
                    updateQuantity(item._id, newQuantity);
                  }
                }}
              >
                <FaPlus />
              </button>
            </div>
          </div>
          <Button
            variant="danger"
            className="rounded-full p-1"
            onClick={() => dispatch(removeFromCart(item._id))}
          >
            <FaTrash />
          </Button>

          <p>Total: ${item.price * item.qty}</p>
        </div>
      ))}
    </>
  );
}

export default CartItemList;
