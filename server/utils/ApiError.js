const { ERROR_CODES } = require('../constants/errorCodes');

/**
 * Custom API Error Class
 * 
 * Extends the native Error class to provide structured error information
 * for API responses. Includes error code, details, and HTTP status code.
 * 
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Create an API error
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Machine-readable error code
   * @param {string} message - Human-readable error message
   * @param {Array} [details=[]] - Array of detailed error information (e.g., validation errors)
   */
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Distinguish operational errors from programming errors
    
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error (400)
   * @param {string} message - Error message
   * @param {Array} details - Validation error details
   * @returns {ApiError}
   */
  static validation(message = 'Validation failed', details = []) {
    return new ApiError(400, ERROR_CODES.VALIDATION_ERROR, message, details);
  }

  /**
   * Create an authentication error (401)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, ERROR_CODES.AUTHENTICATION_ERROR, message);
  }

  /**
   * Create invalid credentials error (401)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static invalidCredentials(message = 'The email or password you entered is incorrect. Please try again.') {
    return new ApiError(401, ERROR_CODES.INVALID_CREDENTIALS, message);
  }

  /**
   * Create an authorization error (403)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static forbidden(message = "You don't have permission to access this resource") {
    return new ApiError(403, ERROR_CODES.AUTHORIZATION_ERROR, message);
  }

  /**
   * Create account not approved error (403)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static accountNotApproved(message = 'Your account is pending approval. Please contact the administrator.') {
    return new ApiError(403, ERROR_CODES.ACCOUNT_NOT_APPROVED, message);
  }

  /**
   * Create a not found error (404)
   * @param {string} resource - Resource name
   * @param {string} [message] - Custom error message
   * @returns {ApiError}
   */
  static notFound(resource = 'Resource', message = null) {
    const defaultMessage = `${resource} not found`;
    return new ApiError(404, ERROR_CODES.NOT_FOUND, message || defaultMessage);
  }

  /**
   * Create a duplicate entry error (409)
   * @param {string} message - Error message
   * @param {Array} details - Duplicate field details
   * @returns {ApiError}
   */
  static duplicate(message = 'Resource already exists', details = []) {
    return new ApiError(409, ERROR_CODES.DUPLICATE_ENTRY, message, details);
  }

  /**
   * Create email already exists error (409)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static emailExists(message = 'An account with this email already exists. Try logging in instead.') {
    return new ApiError(409, ERROR_CODES.EMAIL_ALREADY_EXISTS, message);
  }

  /**
   * Create insufficient inventory error (400)
   * @param {string} message - Error message
   * @param {Array} details - Inventory details
   * @returns {ApiError}
   */
  static insufficientInventory(message = "Sorry, we don't have enough ingredients for this pizza right now.", details = []) {
    return new ApiError(400, ERROR_CODES.INSUFFICIENT_INVENTORY, message, details);
  }

  /**
   * Create payment error (402)
   * @param {string} message - Error message
   * @param {Array} details - Payment error details
   * @returns {ApiError}
   */
  static paymentError(message = 'Payment processing failed. Please try again.', details = []) {
    return new ApiError(402, ERROR_CODES.PAYMENT_FAILED, message, details);
  }

  /**
   * Create email send failed error (500)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static emailSendFailed(message = 'Failed to send email. Please try again later.') {
    return new ApiError(500, ERROR_CODES.EMAIL_SEND_FAILED, message);
  }

  /**
   * Create a server error (500)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static serverError(message = 'An unexpected error occurred. Please try again later.') {
    return new ApiError(500, ERROR_CODES.SERVER_ERROR, message);
  }

  /**
   * Create database error (500)
   * @param {string} message - Error message
   * @returns {ApiError}
   */
  static databaseError(message = 'Database operation failed. Please try again later.') {
    return new ApiError(500, ERROR_CODES.DATABASE_ERROR, message);
  }

  /**
   * Convert error to JSON representation
   * @returns {Object}
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

module.exports = ApiError;
