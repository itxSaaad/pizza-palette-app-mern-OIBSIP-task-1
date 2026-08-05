const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');

// Import Validators
const {
  createPizzaValidation,
  updatePizzaValidation,
} = require('../validators/pizzaValidators');

// Import Controllers
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  createAdminPizza,
  updatePizzaById,
  deletePizzaById,
} = require('../controllers/pizzaControllers');

// Initialize Routes

// Public Routes
router.route('/').get(getAllPizzas);

// Private Routes
router.post('/', protect, createPizzaValidation, validationHandler, createPizza);

// Admin + Private Routes
router.post('/admin', protect, admin, createPizzaValidation, validationHandler, createAdminPizza);
router.get('/:id', getPizzaById);
router
  .route('/:id')
  .put(protect, admin, updatePizzaValidation, validationHandler, updatePizzaById)
  .delete(protect, admin, deletePizzaById);

// Export Router
module.exports = router;
