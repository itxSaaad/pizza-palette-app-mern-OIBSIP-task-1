const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  getAllStocks,
  getStockById,
  updateStockById,
} = require('../controllers/inventoryControllers');

// Initialize Routes

// Public Routes

// Private Routes
router.get('/', protect, getAllStocks);
router.get('/:id', protect, getStockById);

// Admin + Private Routes
router.route('/:id').put(protect, admin, updateStockById);

// Export Router
module.exports = router;
