/**
 * Payment Constants
 * 
 * Defines payment methods and statuses used throughout the system.
 * 
 * NOTE: Keep in sync with backend constants at server/constants/paymentConstants.js
 * 
 * @constant {Object}
 */

/**
 * Available payment methods
 * @constant {string[]} PAYMENT_METHODS
 */
export const PAYMENT_METHODS = Object.freeze(['stripe', 'cod']);

/**
 * Payment method display labels
 * @constant {Object} PAYMENT_METHOD_LABELS
 */
export const PAYMENT_METHOD_LABELS = Object.freeze({
  stripe: 'Credit/Debit Card (Stripe)',
  cod: 'Cash on Delivery'
});

/**
 * Payment status values
 * @constant {Object} PAYMENT_STATUS
 */
export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
});

/**
 * Get all payment status values as an array
 * @returns {string[]} Array of payment status values
 */
export const PAYMENT_STATUS_VALUES = Object.values(PAYMENT_STATUS);

/**
 * Get display color for payment status
 * @param {string} status - Payment status
 * @returns {string} Tailwind color class
 */
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case PAYMENT_STATUS.SUCCESS:
    case PAYMENT_STATUS.PAID:
      return 'text-green-600';
    case PAYMENT_STATUS.PENDING:
      return 'text-yellow-600';
    case PAYMENT_STATUS.FAILED:
      return 'text-red-600';
    case PAYMENT_STATUS.REFUNDED:
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};
