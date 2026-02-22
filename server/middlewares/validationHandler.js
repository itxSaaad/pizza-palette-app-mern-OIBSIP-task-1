const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');
const { ERROR_CODES } = require('../constants/errorCodes');

/**
 * Validation Handler Middleware
 * 
 * Processes express-validator validation results and converts them
 * to structured ApiError format with field-level error details.
 */
const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Extract field-level error details
    const details = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    // Get first error message as the main message
    const mainMessage = errors.array()[0].msg || 'Validation failed. Please check your input';

    // Throw structured ApiError
    throw new ApiError(400, ERROR_CODES.VALIDATION_ERROR, mainMessage, details);
  }
  
  next();
};

module.exports = validationHandler;
