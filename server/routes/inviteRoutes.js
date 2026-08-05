const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');
const validationHandler = require('../middlewares/validationHandler');
const { registrationLimiter } = require('../middlewares/rateLimitMiddleware');

// Import Validators
const {
  createInviteValidation,
  acceptInviteValidation,
} = require('../validators/inviteValidators');

// Import Controllers
const {
  createInvite,
  listInvites,
  revokeInvite,
  acceptInvite,
} = require('../controllers/inviteControllers');

// Initialize Routes

// Public — accepting an invite creates the account, so it can't require auth.
router.post(
  '/accept',
  registrationLimiter,
  acceptInviteValidation,
  validationHandler,
  acceptInvite
);

// Admin-only — creating/listing/revoking invites.
router.post('/', protect, admin, createInviteValidation, validationHandler, createInvite);
router.get('/', protect, admin, listInvites);
router.delete('/:id', protect, admin, revokeInvite);

// Export Router
module.exports = router;
