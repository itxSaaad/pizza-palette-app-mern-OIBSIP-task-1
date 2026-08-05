const { body } = require('express-validator');

const createPizzaValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Pizza name is required')
    .isLength({ min: 2 })
    .withMessage('Pizza name must be at least 2 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('bases')
    .isArray({ min: 1 })
    .withMessage('At least one base is required'),
  body('sauces')
    .isArray({ min: 1 })
    .withMessage('At least one sauce is required'),
  body('cheeses')
    .isArray({ min: 1 })
    .withMessage('At least one cheese is required'),
  body('veggies')
    .isArray()
    .withMessage('Veggies must be an array'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Image URL must be valid'),
];

const updatePizzaValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Pizza name must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('bases')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one base is required'),
  body('sauces')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one sauce is required'),
  body('cheeses')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one cheese is required'),
  body('veggies')
    .optional()
    .isArray()
    .withMessage('Veggies must be an array'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be valid'),
];

module.exports = {
  createPizzaValidation,
  updatePizzaValidation,
};
