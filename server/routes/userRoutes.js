const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');
const { registrationLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  registerValidation,
  verifyUserValidation,
  updateProfileValidation,
  updateUserByIdValidation,
} = require('../validators/userValidators');

// Import Controllers
const {
  registerUser,
  verifyUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userControllers');

// Initialize Routes

// Public Routes — customers are the only self-serve signup path.
// Login/forgot-password/reset-password live at /api/auth (shared with admin).
router.post('/register', registrationLimiter, registerValidation, validationHandler, registerUser);

// Private Routes
router.post('/verify', protect, verifyUserValidation, validationHandler, verifyUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateProfileValidation, validationHandler, updateUserProfile);

// Admin + Private Routes
router.get('/', protect, admin, getAllUsers);
router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserByIdValidation, validationHandler, updateUserById)
  .delete(protect, admin, deleteUserById);

// Export Router
module.exports = router;
