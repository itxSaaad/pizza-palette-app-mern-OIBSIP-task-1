const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().trim(),
];

const verifyUserValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('verificationCode')
    .trim()
    .notEmpty()
    .withMessage('Verification code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be 6 digits'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        return false;
      }
      return true;
    })
    .withMessage('Passwords do not match'),
  body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().trim(),
];

const updateUserByIdValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phoneNumber').optional().trim().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().trim(),
];

module.exports = {
  registerValidation,
  verifyUserValidation,
  updateProfileValidation,
  updateUserByIdValidation,
};
