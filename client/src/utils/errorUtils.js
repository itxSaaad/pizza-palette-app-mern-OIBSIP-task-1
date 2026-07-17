/**
 * Error Utilities
 * 
 * Helper functions for extracting and formatting error information
 * from API responses. Handles both the new standardized error format
 * and legacy error formats for backward compatibility.
 */

/**
 * Extract user-friendly error message from various error formats
 * 
 * @param {*} error - Error object from API or string
 * @returns {string} User-friendly error message
 */
export const extractErrorMessage = (error) => {
  // Handle string errors (legacy format)
  if (typeof error === 'string') {
    return error;
  }

  // Handle new standardized format with error object
  if (error && error.code && error.message) {
    return error.message;
  }

  // Handle axios error response (checked before the generic .message
  // fallback below, since axios errors always carry a generic top-level
  // .message like "Request failed with status code 400" that would
  // otherwise shadow the more useful API error message)
  if (error && error.response && error.response.data) {
    const data = error.response.data;

    // New format: { success: false, error: { code, message, details } }
    if (data.error && data.error.message) {
      return data.error.message;
    }

    // Legacy format: { message: string }
    if (data.message) {
      return data.message;
    }
  }

  // Handle legacy format with status and message
  if (error && error.message) {
    return error.message;
  }

  // Fallback
  return 'An unexpected error occurred. Please try again';
};

/**
 * Get field-level validation errors from error object
 * 
 * @param {Object} error - Error object from API
 * @returns {Array<{field: string, message: string}>} Array of field errors
 */
export const getFieldErrors = (error) => {
  // New format with details array
  if (error && error.details && Array.isArray(error.details)) {
    return error.details;
  }

  // From axios response
  if (error && error.response && error.response.data && error.response.data.error) {
    const apiError = error.response.data.error;
    if (apiError.details && Array.isArray(apiError.details)) {
      return apiError.details;
    }
  }

  return [];
};

/**
 * Format field errors for form display
 * 
 * @param {Object} error - Error object from API
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const formatFieldErrors = (error) => {
  const fieldErrors = getFieldErrors(error);
  const formatted = {};
  
  fieldErrors.forEach(({ field, message }) => {
    formatted[field] = message;
  });
  
  return formatted;
};

/**
 * Check if error is an authentication error
 * 
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const code = error?.code || error?.response?.data?.error?.code;
  return code === 'AUTH_ERROR' || code === 'TOKEN_EXPIRED' || code === 'TOKEN_INVALID';
};

/**
 * Check if error is a validation error
 * 
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  const code = error?.code || error?.response?.data?.error?.code;
  return code === 'VALIDATION_ERROR';
};

/**
 * Check if error is a not found error
 * 
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isNotFoundError = (error) => {
  const code = error?.code || error?.response?.data?.error?.code;
  return code === 'NOT_FOUND';
};

/**
 * Check if error is a network error
 * 
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response || error.code === 'NETWORK_ERROR' || error.message === 'Network Error';
};

/**
 * Get HTTP status code from error
 * 
 * @param {Object} error - Error object
 * @returns {number} HTTP status code
 */
export const getErrorStatus = (error) => {
  // From new format
  if (error && error.statusCode) {
    return error.statusCode;
  }

  // From legacy format
  if (error && error.status) {
    return error.status;
  }

  // From axios response
  if (error && error.response && error.response.status) {
    return error.response.status;
  }

  // Default
  return 500;
};

/**
 * Extract error code from error object
 * 
 * @param {Object} error - Error object
 * @returns {string} Error code
 */
export const getErrorCode = (error) => {
  if (error && error.code) {
    return error.code;
  }

  if (error && error.response && error.response.data && error.response.data.error) {
    return error.response.data.error.code;
  }

  return 'UNKNOWN_ERROR';
};

/**
 * Check if error has field-level details
 * 
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export const hasFieldErrors = (error) => {
  return getFieldErrors(error).length > 0;
};
