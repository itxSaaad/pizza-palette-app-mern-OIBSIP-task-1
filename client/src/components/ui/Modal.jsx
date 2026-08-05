import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg md:max-w-xl',
  lg: 'sm:max-w-2xl md:max-w-3xl',
};

function Modal({ isOpen, onClose, title, size = 'md', children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-900 bg-opacity-40 p-4 backdrop-filter backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full bg-neutral-50 rounded-card shadow-card-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title || undefined}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="font-display text-h3 text-primary-600">{title}</h2>}
          <button
            type="button"
            className="ml-auto text-neutral-500 hover:text-error-600 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-control"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
};

export default Modal;
