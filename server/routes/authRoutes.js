const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const validationHandler = require('../middlewares/validationHandler');
const { authLimiter, passwordResetLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../validators/authValidators');

// Import Controllers
const { login, forgotPassword, resetPassword } = require('../controllers/authControllers');

// Initialize Routes

// Single login entry point for both customers and admin/manager accounts.
router.post('/login', authLimiter, loginValidation, validationHandler, login);
router.post(
  '/forgotpassword',
  passwordResetLimiter,
  forgotPasswordValidation,
  validationHandler,
  forgotPassword
);
router.put(
  '/resetpassword',
  passwordResetLimiter,
  resetPasswordValidation,
  validationHandler,
  resetPassword
);

// Export Router
module.exports = router;
