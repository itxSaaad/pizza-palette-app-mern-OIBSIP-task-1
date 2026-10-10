const { validationResult } = require('express-validator');
const validationHandler = require('../../middlewares/validationHandler');
const ApiError = require('../../utils/ApiError');
const { ERROR_CODES } = require('../../constants/errorCodes');

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('validationHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('calls next() with no arguments when there are no validation errors', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    expect(() => validationHandler(req, res, next)).not.toThrow();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('throws an ApiError.validation(400) built from the first error message when errors exist', () => {
    const errors = [
      { path: 'email', msg: 'Invalid email', value: 'not-an-email' },
      { param: 'price', msg: 'Price must be positive', value: -1 },
    ];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    let thrown;
    try {
      validationHandler(req, res, next);
    } catch (err) {
      thrown = err;
    }

    expect(thrown).toBeInstanceOf(ApiError);
    expect(thrown.statusCode).toBe(400);
    expect(thrown.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(thrown.message).toBe('Invalid email');
    expect(next).not.toHaveBeenCalled();
  });

  it('maps each validation error to field-level details, falling back to param when path is missing', () => {
    const errors = [
      { path: 'email', msg: 'Invalid email', value: 'bad' },
      { param: 'price', msg: 'Price must be positive', value: -1 },
    ];
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => errors,
    });

    let thrown;
    try {
      validationHandler(req, res, next);
    } catch (err) {
      thrown = err;
    }

    expect(thrown.details).toEqual([
      { field: 'email', message: 'Invalid email', value: 'bad' },
      { field: 'price', message: 'Price must be positive', value: -1 },
    ]);
  });

  it('falls back to a default message when the first error has no msg', () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ path: 'name', msg: undefined, value: '' }],
    });

    let thrown;
    try {
      validationHandler(req, res, next);
    } catch (err) {
      thrown = err;
    }

    expect(thrown.message).toBe('Validation failed. Please check your input');
  });
});
