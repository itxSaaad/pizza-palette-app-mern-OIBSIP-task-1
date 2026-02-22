import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Actions
import { updateCartItemQuantity, removeFromCart } from '../../../../redux/slices/cartSlice';

// Import Components
import Button from '../../Button';

function CartItemList() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  return (
    <>
      {cartItems.map((item) => {
        // Create unique key combining ID and size
        const itemKey = `${item._id}-${item.size || 'default'}`;
        
        return (
          <div
            key={itemKey}
            className="flex items-center space-x-4 border-b border-b-orange-300 pb-2"
          >
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12" />
            <div className="flex-grow">
              <p className="font-semibold">{item.name}</p>
              <p>
                Price: ${item.price} | Size:{' '}
                {item.size ? item.size.charAt(0).toUpperCase() + item.size.slice(1) : 'N/A'}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => {
                    const newQuantity = item.qty - 1;
                    if (newQuantity >= 1) {
                      dispatch(updateCartItemQuantity({ 
                        id: item._id, 
                        size: item.size,
                        qty: newQuantity
                      }));
                    }
                  }}
                  disabled={item.qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <FaMinus />
                </button>
                <p className="font-semibold min-w-[60px] text-center">Qty: {item.qty}</p>
                <button
                  className="text-green-500 hover:text-green-700 transition-colors"
                  onClick={() => {
                    const newQuantity = item.qty + 1;
                    if (newQuantity <= 10) {
                      dispatch(updateCartItemQuantity({ 
                        id: item._id, 
                        size: item.size,
                        qty: newQuantity
                      }));
                    }
                  }}
                  disabled={item.qty >= 10}
                  aria-label="Increase quantity"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <Button
              variant="danger"
              className="rounded-full p-1"
              onClick={() => dispatch(removeFromCart({ id: item._id, size: item.size }))}
            >
              <FaTrash />
            </Button>

            <p>Total: ${(item.price * item.qty).toFixed(2)}</p>
          </div>
        );
      })}
    </>
  );
}

export default CartItemList;
