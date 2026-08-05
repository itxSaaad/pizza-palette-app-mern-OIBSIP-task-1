/**
 * API Response Utility
 * 
 * Provides helper methods to create standardized success response objects.
 * All success responses follow a consistent format with success flag, data, and optional message.
 * 
 * @module ApiResponse
 */

class ApiResponse {
  /**
   * Create a success response
   * @param {*} data - Response data
   * @param {string} [message=''] - Success message
   * @param {Object} [metadata=null] - Additional metadata (e.g., pagination info)
   * @returns {Object} Standardized success response
   */
  static success(data, message = '', metadata = null) {
    const response = {
      success: true,
      data
    };

    if (message) {
      response.message = message;
    }

    if (metadata) {
      response.metadata = metadata;
    }

    return response;
  }

  /**
   * Create a paginated response
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination info from paginationUtils
   * @param {string} [message=''] - Success message
   * @returns {Object} Standardized paginated response
   */
  static paginated(data, pagination, message = '') {
    return ApiResponse.success(data, message, { pagination });
  }

  /**
   * Create a created resource response (201)
   * @param {*} data - Created resource data
   * @param {string} [message='Resource created successfully'] - Success message
   * @returns {Object} Standardized success response
   */
  static created(data, message = 'Resource created successfully') {
    return ApiResponse.success(data, message);
  }

  /**
   * Create a no content response (204)
   * @param {string} [message='Operation completed successfully'] - Success message
   * @returns {Object} Standardized success response
   */
  static noContent(message = 'Operation completed successfully') {
    return {
      success: true,
      message
    };
  }

  /**
   * Create a login success response
   * @param {Object} user - User data with token
   * @returns {Object} Standardized success response
   */
  static loginSuccess(user) {
    return ApiResponse.success(user, 'Login successful');
  }

  /**
   * Create a logout success response
   * @returns {Object} Standardized success response
   */
  static logoutSuccess() {
    return ApiResponse.noContent('Logout successful');
  }

  /**
   * Create an update success response
   * @param {*} data - Updated resource data
   * @param {string} [message='Resource updated successfully'] - Success message
   * @returns {Object} Standardized success response
   */
  static updated(data, message = 'Resource updated successfully') {
    return ApiResponse.success(data, message);
  }

  /**
   * Create a delete success response
   * @param {string} [message='Resource deleted successfully'] - Success message
   * @returns {Object} Standardized success response
   */
  static deleted(message = 'Resource deleted successfully') {
    return ApiResponse.noContent(message);
  }
}

module.exports = ApiResponse;
