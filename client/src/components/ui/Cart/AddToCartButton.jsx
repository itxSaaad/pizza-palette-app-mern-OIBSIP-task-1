import PropTypes from 'prop-types';
import { FaCartPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

// Import Thunks
import { addToCart } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';

function AddToCartButton({ id, qty }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id, qty }));
  };
  return (
    <Button
      variant="primary"
      onClick={handleAddToCart}
      className="font-semibold py-2 px-4 rounded-full inline-flex items-center"
    >
      <FaCartPlus className="mr-2" />
      Add to Cart
    </Button>
  );
}

AddToCartButton.propTypes = {
  id: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
};

export default AddToCartButton;
