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
router.get('/:id', getPizzaById);

// Private Routes
router.post('/', protect, createPizza);

// Admin + Private Routes
router
  .route('/:id')
  .put(protect, admin, updatePizzaById)
  .delete(protect, admin, deletePizzaById);

// Export Router
module.exports = router;
