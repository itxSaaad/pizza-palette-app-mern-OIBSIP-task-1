import { FaCartPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Button from '../Button';

function CartButton({ children, ...props }) {
  return (
    <Button
      {...props}
      variant="primary"
      className="text-white font-semibold p-2 sm:p-4 rounded-full inline-flex items-center text-sm sm:text-base"
    >
      <FaCartPlus className="text-xl sm:text-2xl sm:mr-2" />
      <span className="hidden sm:inline-flex">Your Cart</span>
      <span className="ml-2 bg-white text-black rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center">
        {children}
      </span>
    </Button>
  );
}

CartButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartButton;
