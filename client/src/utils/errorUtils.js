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
  const status = error?.response?.status || error?.status || error?.statusCode;

  if (
    error?.code === 'NETWORK_ERROR' ||
    error?.message === 'Network Error' ||
    (!error?.response && error?.isAxiosError)
  ) {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  if (status >= 500) {
    return 'Something went wrong on our end. Please try again in a moment.';
  }

  // Handle string errors (legacy format)
  if (typeof error === 'string') {
    return error;
  }

  // Handle axios error response — this MUST run before the "new
  // standardized format" check below, not after: a real AxiosError also
  // has its own top-level `.code` (e.g. 'ERR_BAD_REQUEST') and `.message`
  // (e.g. "Request failed with status code 400"), which would otherwise
  // false-positive-match that check and shadow the actual, more useful
  // API error message nested in `.response.data`.
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

  // Handle new standardized format with a plain (non-axios) error object,
  // e.g. one already reshaped by a thunk before reaching here.
  if (error && error.code && error.message && !error.response) {
    return error.message;
  }

  // Axios messages such as "Request failed with status code 404" are
  // implementation details; show a useful action instead.
  if (status === 404) return 'We could not find what you were looking for.';
  if (status === 401) return 'Please sign in again to continue.';
  if (status === 403) return "You don't have permission to do that.";
  if (status === 429) return 'You are making requests too quickly. Please wait and try again.';

  // Handle legacy application errors, but hide raw Axios transport messages.
  if (error?.message && !error?.isAxiosError) {
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
