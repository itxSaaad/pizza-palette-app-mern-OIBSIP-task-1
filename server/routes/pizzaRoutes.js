const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizzaById,
  deletePizzaById,
} = require('../controllers/pizzaControllers');

// Initialize Routes

// Public Routes
router.route('/').get(getAllPizzas);

// Private Routes
router.get('/:id', protect, getPizzaById);

// Admin + Private Routes
router.post('/', protect, admin, createPizza);
router
  .route('/:id')
  .put(protect, admin, updatePizzaById)
  .delete(protect, admin, deletePizzaById);

// Export Router
module.exports = router;
