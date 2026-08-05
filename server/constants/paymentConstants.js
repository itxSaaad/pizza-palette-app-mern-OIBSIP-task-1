/**
 * Payment Constants
 *
 * Defines payment methods and statuses used throughout the system.
 *
 * @constant {Object}
 */

/**
 * Available payment methods
 * @constant {string[]} PAYMENT_METHODS
 */
const PAYMENT_METHODS = Object.freeze(['stripe', 'cod']);

/**
 * Payment status values
 * @constant {Object} PAYMENT_STATUS
 */
const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  PAID: 'paid', // For COD when admin confirms payment received
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

/**
 * Get all payment status values as an array
 * @returns {string[]} Array of payment status values
 */
const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

/**
 * Stripe webhook event types
 * @constant {Object} STRIPE_EVENTS
 */
const STRIPE_EVENTS = Object.freeze({
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
});

module.exports = {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_VALUES,
  STRIPE_EVENTS,
};
