const ApiError = require('../../utils/ApiError');
const { ERROR_CODES } = require('../../constants/errorCodes');

describe('ApiError', () => {
  describe('constructor', () => {
    it('sets statusCode, code, message, details and isOperational', () => {
      const details = [{ field: 'name', message: 'required' }];
      const error = new ApiError(400, ERROR_CODES.VALIDATION_ERROR, 'Bad input', details);

      expect(error).toBeInstanceOf(Error);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(error.message).toBe('Bad input');
      expect(error.details).toEqual(details);
      expect(error.isOperational).toBe(true);
    });

    it('defaults details to an empty array', () => {
      const error = new ApiError(500, ERROR_CODES.SERVER_ERROR, 'Oops');
      expect(error.details).toEqual([]);
    });
  });

  describe('static factory methods', () => {
    it('validation() builds a 400 VALIDATION_ERROR with details', () => {
      const details = [{ field: 'email', message: 'Invalid email' }];
      const error = ApiError.validation('Validation failed', details);

      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual(details);
    });

    it('validation() has sensible defaults', () => {
      const error = ApiError.validation();
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual([]);
    });

    it('unauthorized() builds a 401 AUTH_ERROR', () => {
      const error = ApiError.unauthorized();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe(ERROR_CODES.AUTHENTICATION_ERROR);
      expect(error.message).toBe('Authentication required');
    });

    it('invalidCredentials() builds a 401 INVALID_CREDENTIALS', () => {
      const error = ApiError.invalidCredentials();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS);
      expect(error.message).toBe(
        'The email or password you entered is incorrect. Please try again.'
      );
    });

    it('forbidden() builds a 403 FORBIDDEN', () => {
      const error = ApiError.forbidden();
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe(ERROR_CODES.AUTHORIZATION_ERROR);
      expect(error.message).toBe("You don't have permission to access this resource");
    });

    it('notFound() builds a 404 NOT_FOUND with default resource message', () => {
      const error = ApiError.notFound();
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(error.message).toBe('Resource not found');
    });

    it('notFound() uses the given resource name in the default message', () => {
      const error = ApiError.notFound('Pizza');
      expect(error.message).toBe('Pizza not found');
    });

    it('notFound() honors a custom message over the default', () => {
      const error = ApiError.notFound('Route', 'Route /foo not found');
      expect(error.message).toBe('Route /foo not found');
    });

    it('duplicate() builds a 409 DUPLICATE error with details', () => {
      const details = [{ field: 'name', message: "name 'x' already exists" }];
      const error = ApiError.duplicate('Resource already exists', details);
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe(ERROR_CODES.DUPLICATE_ENTRY);
      expect(error.details).toEqual(details);
    });

    it('emailExists() builds a 409 EMAIL_EXISTS', () => {
      const error = ApiError.emailExists();
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe(ERROR_CODES.EMAIL_ALREADY_EXISTS);
      expect(error.message).toBe(
        'An account with this email already exists. Try logging in instead.'
      );
    });

    it('insufficientInventory() builds a 400 LOW_STOCK error with details', () => {
      const details = [{ ingredient: 'cheese', available: 0 }];
      const error = ApiError.insufficientInventory(undefined, details);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ERROR_CODES.INSUFFICIENT_INVENTORY);
      expect(error.details).toEqual(details);
    });

    it('paymentError() builds a 402 PAYMENT_ERROR with details', () => {
      const details = [{ reason: 'card_declined' }];
      const error = ApiError.paymentError('Payment failed', details);
      expect(error.statusCode).toBe(402);
      expect(error.code).toBe(ERROR_CODES.PAYMENT_FAILED);
      expect(error.message).toBe('Payment failed');
      expect(error.details).toEqual(details);
    });

    it('emailSendFailed() builds a 500 EMAIL_SEND_FAILED error', () => {
      const error = ApiError.emailSendFailed();
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ERROR_CODES.EMAIL_SEND_FAILED);
    });

    it('serverError() builds a 500 INTERNAL_ERROR', () => {
      const error = ApiError.serverError();
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ERROR_CODES.SERVER_ERROR);
    });

    it('databaseError() builds a 500 DATABASE_ERROR', () => {
      const error = ApiError.databaseError();
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe(ERROR_CODES.DATABASE_ERROR);
    });
  });

  describe('toJSON()', () => {
    it('returns only code, message and details', () => {
      const details = [{ field: 'price', message: 'must be positive' }];
      const error = new ApiError(400, ERROR_CODES.VALIDATION_ERROR, 'Bad price', details);

      expect(error.toJSON()).toEqual({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Bad price',
        details,
      });
    });

    it('does not leak statusCode or stack via toJSON', () => {
      const error = ApiError.serverError();
      const json = error.toJSON();
      expect(json).not.toHaveProperty('statusCode');
      expect(json).not.toHaveProperty('stack');
    });
  });
});
