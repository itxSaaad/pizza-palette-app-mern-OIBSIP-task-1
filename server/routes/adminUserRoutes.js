const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  authAdmin,
  registerAdmin,
} = require('../controllers/adminUserControllers');

// Initialize Routes

// Public Routes

router.post('/login', authAdmin);
router.post('/register', registerAdmin);

// Private Routes

// Admin + Private Routes

// Export Router
module.exports = router;
