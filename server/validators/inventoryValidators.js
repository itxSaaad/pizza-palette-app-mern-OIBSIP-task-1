const { body } = require('express-validator');
const { INVENTORY_TYPES } = require('../constants');

const createStockValidation = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Stock type is required')
    .isIn(INVENTORY_TYPES)
    .withMessage(`Type must be one of: ${INVENTORY_TYPES.join(', ')}`),
  body('item')
    .trim()
    .notEmpty()
    .withMessage('Item name is required')
    .isLength({ min: 2 })
    .withMessage('Item name must be at least 2 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('threshold')
    .isInt({ min: 0 })
    .withMessage('Threshold must be a non-negative integer'),
  body('quantity')
    .custom((value, { req }) => value >= req.body.threshold)
    .withMessage('Quantity cannot be less than threshold'),
];

const updateStockValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

module.exports = {
  createStockValidation,
  updateStockValidation,
};
