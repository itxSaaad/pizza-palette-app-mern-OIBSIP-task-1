const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');
const { authLimiter, registrationLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  adminRegisterValidation,
  adminLoginValidation,
  updateAdminProfileValidation,
  updateAdminByIdValidation,
} = require('../validators/adminValidators');

// Import Controllers
const {
  authAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
} = require('../controllers/adminUserControllers');

// Initialize Routes

// Public Routes
router.post('/login', authLimiter, adminLoginValidation, validationHandler, authAdmin);
router.post('/register', registrationLimiter, adminRegisterValidation, validationHandler, registerAdmin);

// Private Routes
router
  .route('/profile')
  .get(protect, getAdminProfile)
  .put(protect, updateAdminProfileValidation, validationHandler, updateAdminProfile);

// Admin + Private Routes
router.get('/', protect, admin, getAllAdmins);
router
  .route('/:id')
  .get(protect, admin, getAdminById)
  .put(protect, admin, updateAdminByIdValidation, validationHandler, updateAdminById)
  .delete(protect, admin, deleteAdminById);

// Export Router
module.exports = router;
