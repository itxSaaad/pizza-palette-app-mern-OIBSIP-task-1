const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const { verifyCronSecret } = require('../middlewares/cronAuthMiddleware');
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
  getLowInventoryItems,
  runScheduledCheck,
} = require('../controllers/inventoryAlertControllers');

// Initialize Routes

// Public Routes

// Private Routes
router.get('/', protect, getAllStocks);

// Inventory Alert Routes — registered before /:id, since Express would
// otherwise match "check-alerts"/"low-stock" as an :id value and these
// routes would never be reached.
router.post('/check-alerts', protect, admin, checkAndSendAlerts);
router.get('/low-stock', protect, admin, getLowInventoryItems);
// Triggered by Vercel Cron in production (see server/vercel.json) since
// node-cron can't run inside a serverless function — auth is a shared
// secret, not an admin session (see cronAuthMiddleware).
router.get('/cron/check-alerts', verifyCronSecret, runScheduledCheck);

router.get('/:id', protect, getStockById);

// Admin + Private Routes
router.post('/', protect, admin, createStockValidation, validationHandler, createStock);
router
  .route('/:id')
  .put(protect, admin, updateStockValidation, validationHandler, updateStockById)
  .delete(protect, admin, deleteStockById);

// Export Router
module.exports = router;
