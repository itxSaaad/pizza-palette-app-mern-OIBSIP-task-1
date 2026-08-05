const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');
const { paymentLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  createOrderValidation,
  updateOrderValidation,
} = require('../validators/orderValidators');

// Import Controllers
const {
  createOrder,
  createStripeCheckoutSession,
  updateOrderPaymentStatus,
  getOrdersByUserId,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById
} = require('../controllers/orderControllers');

// Initialize Routes

// Note: POST /stripe-webhook is registered directly on the Express app in
// server/index.js, before the global JSON body parsers, since Stripe's
// signature verification needs the raw request body. It is intentionally
// not registered here to avoid a dead duplicate route definition.

// Private Routes
router.route('/').post(protect, createOrderValidation, validationHandler, createOrder);
router.route('/user').get(protect, getOrdersByUserId);
router.route('/create-checkout-session').post(protect, paymentLimiter, createStripeCheckoutSession);

// User can view their own order, Admin can view any order
router.route('/:id').get(protect, getOrderById);

// Admin Routes
router.route('/').get(protect, admin, getAllOrders);
router
  .route('/:id')
  .put(protect, admin, updateOrderValidation, validationHandler, updateOrderById)
  .delete(protect, admin, deleteOrderById);
router.route('/:id/payment-status').patch(protect, admin, updateOrderPaymentStatus);

// Export Router
module.exports = router;
