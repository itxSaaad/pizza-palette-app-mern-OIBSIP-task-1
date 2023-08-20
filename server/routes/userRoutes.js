const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userControllers');

// Initialize Routes

// Public Routes
router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);

// Private Routes

router.get('/verify', protect, verifyUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin + Private Routes

// Export Router
module.exports = router;
