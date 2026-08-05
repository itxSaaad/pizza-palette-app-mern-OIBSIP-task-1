const { body } = require('express-validator');
const { ADMIN_ROLES } = require('../constants');

const createInviteValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(ADMIN_ROLES)
    .withMessage(`Role must be one of: ${ADMIN_ROLES.join(', ')}`),
];

const acceptInviteValidation = [
  body('token').trim().notEmpty().withMessage('Invite token is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
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
];

module.exports = { createInviteValidation, acceptInviteValidation };
