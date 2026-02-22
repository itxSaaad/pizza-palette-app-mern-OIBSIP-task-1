const { ERROR_CODES } = require('../constants/errorCodes');

/**
 * Error Code Mapper
 * 
 * Maps error codes to user-friendly messages.
 * Provides consistent, helpful error messages across the application.
 * Can be extended to support multiple languages in the future.
 * 
 * @module errorCodeMapper
 */

/**
 * User-friendly error messages mapped to error codes
 */
const errorMessages = {
  // Validation Errors
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again',
  [ERROR_CODES.INVALID_INPUT]: 'The information you provided is invalid',
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields',
  
  // Authentication Errors
  [ERROR_CODES.AUTHENTICATION_ERROR]: 'Authentication required. Please log in',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'The email or password you entered is incorrect',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ERROR_CODES.TOKEN_INVALID]: 'Invalid authentication token. Please log in again',
  [ERROR_CODES.EMAIL_NOT_VERIFIED]: 'Please verify your email address before continuing',
  
  // Authorization Errors
  [ERROR_CODES.AUTHORIZATION_ERROR]: "You don't have permission to access this resource",
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: 'You need additional permissions to perform this action',
  [ERROR_CODES.ACCOUNT_NOT_APPROVED]: 'Your account is pending approval. Please contact the administrator',
  
  // Not Found Errors
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.USER_NOT_FOUND]: 'User not found',
  [ERROR_CODES.ORDER_NOT_FOUND]: 'Order not found',
  [ERROR_CODES.PIZZA_NOT_FOUND]: 'Pizza not found',
  
  // Conflict Errors
  [ERROR_CODES.DUPLICATE_ENTRY]: 'This resource already exists',
  [ERROR_CODES.EMAIL_ALREADY_EXISTS]: 'An account with this email already exists. Try logging in instead',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'A resource with this information already exists',
  
  // Business Logic Errors
  [ERROR_CODES.INSUFFICIENT_INVENTORY]: "Sorry, we don't have enough ingredients for this pizza right now",
  [ERROR_CODES.INVENTORY_UNAVAILABLE]: 'Some ingredients are currently unavailable',
  [ERROR_CODES.INVALID_ORDER_STATUS]: 'Invalid order status',
  
  // Payment Errors
  [ERROR_CODES.PAYMENT_FAILED]: 'Payment processing failed. Please try again',
  [ERROR_CODES.PAYMENT_INVALID]: 'Invalid payment information',
  [ERROR_CODES.PAYMENT_SIGNATURE_INVALID]: 'Payment verification failed',
  [ERROR_CODES.WEBHOOK_VERIFICATION_FAILED]: 'Webhook verification failed',
  
  // Server Errors
  [ERROR_CODES.SERVER_ERROR]: 'An unexpected error occurred. Please try again later',
  [ERROR_CODES.DATABASE_ERROR]: 'Database error occurred. Please try again later',
  [ERROR_CODES.EMAIL_SEND_FAILED]: 'Failed to send email. Please try again later',
  
  // Network Errors (Client-side)
  [ERROR_CODES.NETWORK_ERROR]: 'Network error occurred. Please check your connection',
  [ERROR_CODES.REQUEST_TIMEOUT]: 'Request timed out. Please try again'
};

/**
 * Get user-friendly message for an error code
 * @param {string} code - Error code
 * @param {string} [defaultMessage='An error occurred'] - Default message if code not found
 * @returns {string} User-friendly error message
 */
const getUserFriendlyMessage = (code, defaultMessage = 'An error occurred') => {
  return errorMessages[code] || defaultMessage;
};

/**
 * Map HTTP status code to generic error code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error code
 */
const mapStatusToErrorCode = (statusCode) => {
  if (statusCode >= 500) {
    return ERROR_CODES.SERVER_ERROR;
  } else if (statusCode === 404) {
    return ERROR_CODES.NOT_FOUND;
  } else if (statusCode === 403) {
    return ERROR_CODES.AUTHORIZATION_ERROR;
  } else if (statusCode === 401) {
    return ERROR_CODES.AUTHENTICATION_ERROR;
  } else if (statusCode === 409) {
    return ERROR_CODES.DUPLICATE_ENTRY;
  } else if (statusCode === 400) {
    return ERROR_CODES.VALIDATION_ERROR;
  }
  return ERROR_CODES.SERVER_ERROR;
};

/**
 * Check if error code is a client error (4xx)
 * @param {string} code - Error code
 * @returns {boolean}
 */
const isClientError = (code) => {
  const clientErrors = [
    ERROR_CODES.VALIDATION_ERROR,
    ERROR_CODES.AUTHENTICATION_ERROR,
    ERROR_CODES.AUTHORIZATION_ERROR,
    ERROR_CODES.NOT_FOUND,
    ERROR_CODES.DUPLICATE_ENTRY,
    ERROR_CODES.INSUFFICIENT_INVENTORY
  ];
  return clientErrors.includes(code);
};

/**
 * Check if error code is a server error (5xx)
 * @param {string} code - Error code
 * @returns {boolean}
 */
const isServerError = (code) => {
  const serverErrors = [
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.DATABASE_ERROR,
    ERROR_CODES.EMAIL_SEND_FAILED
  ];
  return serverErrors.includes(code);
};

module.exports = {
  getUserFriendlyMessage,
  mapStatusToErrorCode,
  isClientError,
  isServerError,
  errorMessages
};
