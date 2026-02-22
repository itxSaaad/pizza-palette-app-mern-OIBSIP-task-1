const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');

// Import Validators
const {
  createStockValidation,
  updateStockValidation,
} = require('../validators/inventoryValidators');

// Import Controllers
const {
  getAllStocks,
  getStockById,
  createStock,
  updateStockById,
  deleteStockById,
} = require('../controllers/inventoryControllers');

const {
  checkAndSendAlerts,
  getLowInventoryItems
} = require('../controllers/inventoryAlertControllers');

// Initialize Routes

// Public Routes

// Private Routes
router.get('/', protect, getAllStocks);
router.get('/:id', protect, getStockById);

// Admin + Private Routes
router.post('/', protect, admin, createStockValidation, validationHandler, createStock);
router
  .route('/:id')
  .put(protect, admin, updateStockValidation, validationHandler, updateStockById)
  .delete(protect, admin, deleteStockById);

// Inventory Alert Routes
router.post('/check-alerts', protect, admin, checkAndSendAlerts);
router.get('/low-stock', protect, admin, getLowInventoryItems);

// Export Router
module.exports = router;
