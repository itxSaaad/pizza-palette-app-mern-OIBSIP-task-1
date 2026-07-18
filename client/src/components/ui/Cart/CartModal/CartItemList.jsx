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
        const itemKey = `${item._id}-${item.size || 'default'}`;

        return (
          <div
            key={itemKey}
            className="flex items-center space-x-4 border-b border-b-neutral-200 pb-2"
          >
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-control object-cover" />
            <div className="flex-grow">
              <p className="font-semibold text-neutral-900">{item.name}</p>
              <p className="text-neutral-600">
                Price: ${item.price} | Size:{' '}
                {item.size ? item.size.charAt(0).toUpperCase() + item.size.slice(1) : 'N/A'}
              </p>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  className="text-error-500 hover:text-error-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-control disabled:opacity-40 disabled:cursor-not-allowed"
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
                <p className="font-semibold min-w-[60px] text-center text-neutral-800">Qty: {item.qty}</p>
                <button
                  type="button"
                  className="text-accent-green-600 hover:text-accent-green-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-control disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="rounded-pill p-2"
              onClick={() => dispatch(removeFromCart({ id: item._id, size: item.size }))}
              aria-label={`Remove ${item.name} from cart`}
            >
              <FaTrash />
            </Button>

            <p className="text-neutral-900">Total: ${(item.price * item.qty).toFixed(2)}</p>
          </div>
        );
      })}
    </>
  );
}

export default CartItemList;
