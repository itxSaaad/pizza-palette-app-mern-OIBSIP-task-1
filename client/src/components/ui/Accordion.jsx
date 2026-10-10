import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown } from 'react-icons/fa';

function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-neutral-900 hover:text-primary-600 transition-colors duration-150 min-h-[44px]"
      >
        <span>{title}</span>
        <FaChevronDown
          className={`flex-shrink-0 ml-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-neutral-700 leading-relaxed">{children}</div>
      )}
    </div>
  );
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

export default Accordion;
