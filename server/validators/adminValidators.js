const { body } = require('express-validator');
const { ADMIN_ROLES } = require('../constants');

// Only used by the one-time first-admin bootstrap endpoint — every
// subsequent admin/manager is created via the invite flow, so there's no
// "register as admin" form/role choice here.
const setupAdminValidation = [
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
    .isString()
    .withMessage('Password must be text')
    .bail()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 12 })
    .withMessage('Use a unique password with at least 12 characters')
    .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
    .withMessage('Password must be no more than 72 UTF-8 bytes'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  body('setupKey')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Setup key must be text')
    .bail()
    .isLength({ max: 512 })
    .withMessage('Setup key is too long'),
];

const updateAdminProfileValidation = [
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
];

const updateAdminByIdValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email').optional().trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('role')
    .optional()
    .isIn(ADMIN_ROLES)
    .withMessage(`Role must be one of: ${ADMIN_ROLES.join(', ')}`),
  body('isApproved').optional().isBoolean().withMessage('isApproved must be a boolean'),
];

module.exports = {
  setupAdminValidation,
  updateAdminProfileValidation,
  updateAdminByIdValidation,
};
