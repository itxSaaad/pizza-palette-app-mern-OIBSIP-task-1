import PropTypes from 'prop-types';
import { FaCartPlus } from 'react-icons/fa';

import Button from '../Button';

function AddToCartButton({ onClick }) {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      className="font-semibold py-2 px-4 rounded-full inline-flex items-center"
    >
      <FaCartPlus className="mr-2" />
      Add to Cart
    </Button>
  );
}

AddToCartButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddToCartButton;
