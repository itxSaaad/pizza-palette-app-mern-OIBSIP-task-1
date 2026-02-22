const { body } = require('express-validator');
const { ORDER_STATUS_VALUES, PAYMENT_METHODS } = require('../constants');

const createOrderValidation = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('orderItems.*.pizza')
    .optional()
    .isMongoId()
    .withMessage('Invalid pizza ID'),
  body('orderItems.*._id')
    .optional()
    .isMongoId()
    .withMessage('Invalid pizza ID'),
  body('orderItems.*.qty')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('deliveryAddress.phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('deliveryAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('deliveryAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  body('deliveryAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('salesTax')
    .isFloat({ min: 0 })
    .withMessage('Sales tax must be a positive number'),
  body('deliveryCharges')
    .isFloat({ min: 0 })
    .withMessage('Delivery charges must be a positive number'),
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number')
    .custom((value) => value > 0)
    .withMessage('Total price must be greater than 0'),
  body('payment.method')
    .trim()
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(PAYMENT_METHODS)
    .withMessage(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`),
  body('payment.status')
    .optional()
    .trim(),
];

const updateOrderValidation = [
  body('status')
    .optional()
    .trim()
    .isIn(ORDER_STATUS_VALUES)
    .withMessage(`Invalid order status. Must be one of: ${ORDER_STATUS_VALUES.join(', ')}`),
];

module.exports = {
  createOrderValidation,
  updateOrderValidation,
};
