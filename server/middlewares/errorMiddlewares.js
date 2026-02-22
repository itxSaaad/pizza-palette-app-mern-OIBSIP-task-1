const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const { ERROR_CODES } = require('../constants/errorCodes');
const { mapStatusToErrorCode } = require('../utils/errorCodeMapper');

/**
 * Not Found Middleware
 * Handles 404 errors for routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = ApiError.notFound('Route', `Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Enhanced Error Handler Middleware
 * 
 * Provides structured error responses with:
 * - Error codes for programmatic handling
 * - User-friendly messages
 * - Field-level validation details
 * - Request metadata for debugging
 * 
 * Handles:
 * - ApiError instances (custom errors)
 * - Mongoose validation errors
 * - Mongoose CastError (invalid ObjectId)
 * - MongoDB duplicate key errors (E11000)
 * - Generic JavaScript errors
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Generate unique request ID for tracking
  const requestId = uuidv4();

  // If it's already an ApiError, use it as is
  if (!(error instanceof ApiError)) {
    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError') {
      const details = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      }));
      
      error = new ApiError(
        400,
        ERROR_CODES.VALIDATION_ERROR,
        'Validation failed. Please check your input',
        details
      );
    }
    // Handle Mongoose CastError (invalid ObjectId)
    else if (error.name === 'CastError') {
      const message = `Invalid ${error.path}: ${error.value}`;
      error = new ApiError(400, ERROR_CODES.INVALID_INPUT, message);
    }
    // Handle MongoDB duplicate key error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      const details = [{
        field,
        message: `${field} '${value}' already exists`
      }];
      
      // Special handling for email field
      if (field === 'email') {
        error = ApiError.emailExists();
      } else {
        error = new ApiError(
          409,
          ERROR_CODES.DUPLICATE_ENTRY,
          `A resource with this ${field} already exists`,
          details
        );
      }
    }
    // Handle JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(401, ERROR_CODES.TOKEN_INVALID, 'Invalid token. Please log in again');
    }
    else if (error.name === 'TokenExpiredError') {
      error = new ApiError(401, ERROR_CODES.TOKEN_EXPIRED, 'Your session has expired. Please log in again');
    }
    // Generic error - convert to ApiError
    else {
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      const code = mapStatusToErrorCode(statusCode);
      error = new ApiError(statusCode, code, error.message || 'An error occurred');
    }
  }

  // Set status code
  const statusCode = error.statusCode || 500;
  res.status(statusCode);

  // Build error response
  const errorResponse = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && error.details.length > 0 && { details: error.details }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      requestId
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    errorResponse.error.stack = error.stack;
  }

  // Log error for debugging (in production, this would go to logging service)
  if (statusCode >= 500) {
    console.error('Server Error:', {
      requestId,
      error: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method
    });
  }

  res.json(errorResponse);
};

module.exports = { notFound, errorHandler };
