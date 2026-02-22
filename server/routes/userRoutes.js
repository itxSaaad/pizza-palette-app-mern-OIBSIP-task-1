const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');
const { authLimiter, registrationLimiter, passwordResetLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  registerValidation,
  loginValidation,
  verifyUserValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  updateUserByIdValidation,
} = require('../validators/userValidators');

// Import Controllers
const {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/userControllers');

// Initialize Routes

// Public Routes
router.post('/login', authLimiter, loginValidation, validationHandler, authUser);
router.post('/register', registrationLimiter, registerValidation, validationHandler, registerUser);
router.post('/forgotpassword', passwordResetLimiter, forgotPasswordValidation, validationHandler, forgotPassword);
router.put('/resetpassword', passwordResetLimiter, resetPasswordValidation, validationHandler, resetPassword);

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
