const rateLimit = require('express-rate-limit');
const { ERROR_CODES } = require('../constants/errorCodes');

// Sends the same JSON error envelope as the rest of the API (ApiError/errorMiddlewares
// shape), instead of express-rate-limit's default plain-text body — otherwise the
// frontend's extractErrorMessage falls through to axios's generic "Request failed
// with status code 429" text since there's no error.response.data.error.message to read.
const jsonRateLimitHandler = (message) => (req, res) => {
  res.status(429).json({
    success: false,
    error: {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    },
  });
};

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Too many requests. Please try again in 15 minutes.'),
});

// Auth rate limiter (5 login attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Too many login attempts. Please try again in 15 minutes.'),
});

// Registration rate limiter (3 registrations per hour)
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Too many registration attempts. Please try again in an hour.'),
});

// Payment rate limiter (10 payment requests per 15 minutes)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Too many payment requests. Please try again in 15 minutes.'),
});

// Password reset rate limiter (3 attempts per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonRateLimitHandler('Too many password reset attempts. Please try again in an hour.'),
});

module.exports = {
  apiLimiter,
  authLimiter,
  registrationLimiter,
  paymentLimiter,
  passwordResetLimiter
};
