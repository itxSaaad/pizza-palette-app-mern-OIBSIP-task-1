const { body } = require('express-validator');
const { ADMIN_ROLES } = require('../constants');

const adminRegisterValidation = [
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
  body('role')
    .optional()
    .isIn(ADMIN_ROLES)
    .withMessage(`Role must be one of: ${ADMIN_ROLES.join(', ')}`),
];

const adminLoginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updateAdminProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
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
];

const updateAdminByIdValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(ADMIN_ROLES)
    .withMessage(`Role must be one of: ${ADMIN_ROLES.join(', ')}`),
  body('isApproved')
    .optional()
    .isBoolean()
    .withMessage('isApproved must be a boolean'),
];

module.exports = {
  adminRegisterValidation,
  adminLoginValidation,
  updateAdminProfileValidation,
  updateAdminByIdValidation,
};
