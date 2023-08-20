const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

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
router.post('/login', authAdmin);
router.post('/register', registerAdmin);

// Private Routes
router
  .route('/profile')
  .get(protect, getAdminProfile)
  .put(protect, updateAdminProfile);

// Admin + Private Routes
router.get('/', protect, admin, getAllAdmins);
router
  .route('/:id')
  .get(protect, admin, getAdminById)
  .put(protect, admin, updateAdminById)
  .delete(protect, admin, deleteAdminById);

// Export Router
module.exports = router;
