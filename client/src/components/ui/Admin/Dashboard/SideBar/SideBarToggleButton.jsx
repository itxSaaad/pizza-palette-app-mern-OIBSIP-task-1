import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function SideBarToggleButton({ onClick, isOpen }) {
  return (
    <button
      type="button"
      className="flex flex-row items-center justify-center fixed left-0 top-20 z-10 m-4 min-h-[44px] text-white bg-primary-700 hover:bg-primary-800 rounded-pill p-2 text-lg focus:outline-none"
      onClick={onClick}
      aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      <span className="hidden sm:block sm:ml-2">
        {isOpen ? ' Collapse' : ' Expand'}
      </span>
    </button>
  );
}

SideBarToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default SideBarToggleButton;
