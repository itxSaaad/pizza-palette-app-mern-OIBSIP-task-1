import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import { extractErrorMessage, getFieldErrors, getErrorCode } from '../../utils/errorUtils';

/**
 * Message Component
 * 
 * Flexible alert component that supports multiple error formats:
 * - New standardized format: { code: 'ERROR_CODE', message: 'message', details: [] }
 * - Legacy format: { status: 400, message: 'message' }
 * - String format: "Error message"
 * - Success format: { success: true, message: 'message' }
 */
const Message = ({ children, variant = 'auto', onClose }) => {
  const successStyles =
    'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-sm';
  const warningStyles =
    'bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative shadow-sm';
  const errorStyles =
    'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-sm';
  const infoStyles =
    'bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative shadow-sm';

  const styles = {
    success: successStyles,
    warning: warningStyles,
    error: errorStyles,
    info: infoStyles,
  };

  const iconComponents = {
    success: FaCheckCircle,
    warning: FaExclamationCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
  };

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  if (!visible) {
    return null;
  }

  // Use utility functions to extract error information
  const message = extractErrorMessage(children);
  const errorCode = getErrorCode(children);
  const fieldErrors = getFieldErrors(children);
  
  // Determine variant based on error code or children properties
  let messageVariant = variant;
  
  if (messageVariant === 'auto') {
    // Check for success
    if (children && children.success) {
      messageVariant = 'success';
    }
    // Check error code patterns
    else if (errorCode && errorCode !== 'UNKNOWN_ERROR') {
      if (errorCode.includes('AUTH') || errorCode.includes('FORBIDDEN')) {
        messageVariant = 'warning';
      } else if (errorCode.includes('VALIDATION')) {
        messageVariant = 'warning';
      } else {
        messageVariant = 'error';
      }
    }
    // Check legacy status
    else if (children && children.status !== undefined) {
      const status = children.status;
      if (status >= 200 && status <= 299) {
        messageVariant = 'success';
      } else if (status >= 400 && status <= 499) {
        messageVariant = 'warning';
      } else if (status >= 500 && status <= 599) {
        messageVariant = 'error';
      } else {
        messageVariant = 'info';
      }
    }
    // String errors default to error
    else if (typeof children === 'string') {
      messageVariant = 'error';
    }
    // Default to info
    else {
      messageVariant = 'info';
    }
  }

  const alertStyle = styles[messageVariant] || styles.error;
  const Icon = iconComponents[messageVariant] || iconComponents.info;

  const getStatusLabel = () => {
    switch (messageVariant) {
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'info':
        return 'Info';
      default:
        return '';
    }
  };

  return (
    <div className={alertStyle} role="alert">
      <div className="flex items-start">
        {Icon && <Icon className="mt-0.5 mr-3 flex-shrink-0" size={20} />}
        <div className="flex-1">
          <div>
            <strong className="font-bold">
              {getStatusLabel()}
              {errorCode && ` (${errorCode})`}:
            </strong>
            <span className="block sm:inline sm:ml-2">{message}</span>
          </div>
          
          {/* Display field-level errors if present */}
          {fieldErrors.length > 0 && (
            <ul className="mt-2 ml-4 list-disc text-sm">
              {fieldErrors.map((error, index) => (
                <li key={index}>
                  <strong>{error.field}:</strong> {error.message}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Close button */}
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <FaTimesCircle size={18} />
        </button>
      </div>
    </div>
  );
};

Message.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  variant: PropTypes.oneOf(['auto', 'success', 'warning', 'error', 'info']),
  onClose: PropTypes.func,
};

export default Message;
