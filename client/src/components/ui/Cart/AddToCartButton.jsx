import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

// Import Constants
import { getPizzaSizeMultiplier } from '../../../constants';

// Import Thunks
import { getUserDetails } from '../../../redux/asyncThunks/userThunks';
import { addToCart } from '../../../redux/slices/cartSlice';

// Import Components
import Button from '../Button';
import Message from '../Message';

function AddToCartButton({ id, qty, size, basePrice }) {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user);
  const { userDetails } = user;

  const handleAddToCart = () => {
    if (userDetails && !userDetails.isVerified) {
      setError('Please verify your email address before adding items to cart');
      setTimeout(() => setError(null), 5000);
    } else {
      setError(null);
      const multiplier = getPizzaSizeMultiplier(size);
      const calculatedPrice = basePrice * multiplier;
      
      dispatch(addToCart({ 
        id, 
        qty, 
        size,
        calculatedPrice
      }));
    }
  };

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails({}));
    }
  }, [dispatch, userDetails]);

  return (
    <>
      {error && <Message variant="warning">{error}</Message>}
      <Button
        variant="primary"
        onClick={handleAddToCart}
        className="font-semibold py-2 px-4 rounded-full inline-flex items-center"
      >
        <FaCartPlus className="mr-2" />
        Add to Cart
      </Button>
    </>
  );
}

AddToCartButton.propTypes = {
  id: PropTypes.string.isRequired,
  qty: PropTypes.number.isRequired,
  size: PropTypes.string.isRequired,
  basePrice: PropTypes.number.isRequired,
};

export default AddToCartButton;
