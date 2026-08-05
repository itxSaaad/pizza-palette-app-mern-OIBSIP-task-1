import { describe, it, expect } from 'vitest';
import {
  extractErrorMessage,
  getFieldErrors,
  formatFieldErrors,
  isAuthError,
  isValidationError,
  isNotFoundError,
  isNetworkError,
  getErrorStatus,
  getErrorCode,
  hasFieldErrors,
} from './errorUtils';

describe('extractErrorMessage', () => {
  it('returns the string as-is for plain string errors', () => {
    expect(extractErrorMessage('Something went wrong')).toBe('Something went wrong');
  });

  it('returns message for the new standardized { code, message } format', () => {
    expect(extractErrorMessage({ code: 'VALIDATION_ERROR', message: 'Invalid input' })).toBe(
      'Invalid input'
    );
  });

  it('prefers the API error message over the generic axios message for the new format', () => {
    const axiosError = {
      message: 'Request failed with status code 400',
      response: {
        status: 400,
        data: {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Email is required' },
        },
      },
    };
    expect(extractErrorMessage(axiosError)).toBe('Email is required');
  });

  it('falls back to legacy axios response { message } format', () => {
    const axiosError = {
      message: 'Request failed with status code 404',
      response: {
        status: 404,
        data: { message: 'Pizza not found' },
      },
    };
    expect(extractErrorMessage(axiosError)).toBe('Pizza not found');
  });

  it('handles legacy { status, message } errors (no response wrapper)', () => {
    expect(extractErrorMessage({ status: 400, message: 'Bad request' })).toBe('Bad request');
  });

  it('falls back to the generic axios message when there is no response data', () => {
    expect(extractErrorMessage({ message: 'Network Error' })).toBe('Network Error');
  });

  it('returns a fallback message for unrecognized shapes', () => {
    expect(extractErrorMessage({})).toBe('An unexpected error occurred. Please try again');
    expect(extractErrorMessage(null)).toBe('An unexpected error occurred. Please try again');
    expect(extractErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again');
  });
});

describe('getFieldErrors', () => {
  it('returns details array from the new standardized format', () => {
    const details = [{ field: 'email', message: 'Invalid email' }];
    expect(getFieldErrors({ details })).toEqual(details);
  });

  it('extracts details from an axios response error', () => {
    const details = [{ field: 'password', message: 'Too short' }];
    const axiosError = {
      response: { data: { error: { details } } },
    };
    expect(getFieldErrors(axiosError)).toEqual(details);
  });

  it('returns an empty array when there are no field errors', () => {
    expect(getFieldErrors({})).toEqual([]);
    expect(getFieldErrors('some string error')).toEqual([]);
  });
});

describe('formatFieldErrors', () => {
  it('converts a details array into a field->message map', () => {
    const error = {
      details: [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Too short' },
      ],
    };
    expect(formatFieldErrors(error)).toEqual({
      email: 'Invalid email',
      password: 'Too short',
    });
  });

  it('returns an empty object when there are no details', () => {
    expect(formatFieldErrors({})).toEqual({});
  });
});

describe('getErrorCode', () => {
  it('returns the code from the new standardized format', () => {
    expect(getErrorCode({ code: 'AUTH_ERROR' })).toBe('AUTH_ERROR');
  });

  it('extracts the code from an axios response error', () => {
    const axiosError = { response: { data: { error: { code: 'NOT_FOUND' } } } };
    expect(getErrorCode(axiosError)).toBe('NOT_FOUND');
  });

  it('defaults to UNKNOWN_ERROR when no code is present', () => {
    expect(getErrorCode({})).toBe('UNKNOWN_ERROR');
    expect(getErrorCode('a plain string error')).toBe('UNKNOWN_ERROR');
  });
});

describe('isAuthError / isValidationError / isNotFoundError', () => {
  it('recognizes auth-related codes directly and via axios response', () => {
    expect(isAuthError({ code: 'AUTH_ERROR' })).toBe(true);
    expect(isAuthError({ code: 'TOKEN_EXPIRED' })).toBe(true);
    expect(isAuthError({ code: 'TOKEN_INVALID' })).toBe(true);
    expect(isAuthError({ response: { data: { error: { code: 'AUTH_ERROR' } } } })).toBe(true);
    expect(isAuthError({ code: 'VALIDATION_ERROR' })).toBe(false);
  });

  it('recognizes validation errors', () => {
    expect(isValidationError({ code: 'VALIDATION_ERROR' })).toBe(true);
    expect(isValidationError({ code: 'AUTH_ERROR' })).toBe(false);
  });

  it('recognizes not-found errors', () => {
    expect(isNotFoundError({ code: 'NOT_FOUND' })).toBe(true);
    expect(isNotFoundError({ code: 'AUTH_ERROR' })).toBe(false);
  });
});

describe('isNetworkError', () => {
  it('treats an axios error with no response as a network error', () => {
    expect(isNetworkError({ message: 'Network Error' })).toBe(true);
  });

  it('treats a NETWORK_ERROR code as a network error', () => {
    expect(isNetworkError({ code: 'NETWORK_ERROR', response: {} })).toBe(true);
  });

  it('is false when a response is present and code/message do not indicate a network failure', () => {
    expect(isNetworkError({ response: { status: 404 }, message: 'Not Found' })).toBe(false);
  });
});

describe('getErrorStatus', () => {
  it('reads statusCode from the new standardized format', () => {
    expect(getErrorStatus({ statusCode: 422 })).toBe(422);
  });

  it('reads legacy status field', () => {
    expect(getErrorStatus({ status: 400 })).toBe(400);
  });

  it('reads status from an axios response', () => {
    expect(getErrorStatus({ response: { status: 401 } })).toBe(401);
  });

  it('defaults to 500 when no status information is present', () => {
    expect(getErrorStatus({})).toBe(500);
  });
});

describe('hasFieldErrors', () => {
  it('is true when field errors exist', () => {
    expect(hasFieldErrors({ details: [{ field: 'email', message: 'Invalid' }] })).toBe(true);
  });

  it('is false when there are no field errors', () => {
    expect(hasFieldErrors({})).toBe(false);
  });
});
