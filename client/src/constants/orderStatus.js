/**
 * Order Status Constants
 * 
 * Defines all possible order statuses in the system.
 * These values are used throughout the frontend for display and filtering.
 * 
 * NOTE: Keep in sync with backend constants at server/constants/orderStatus.js
 * 
 * @constant {Object} ORDER_STATUS
 */

export const ORDER_STATUS = Object.freeze({
  RECEIVED: 'Received',
  IN_KITCHEN: 'In the Kitchen',
  OUT_FOR_DELIVERY: 'Sent for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
});

/**
 * Get all order status values as an array
 * @returns {string[]} Array of order status values
 */
export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

/**
 * Get display color for order status
 * @param {string} status - Order status
 * @returns {string} Tailwind color class
 */
export const getOrderStatusColor = (status) => {
  switch (status) {
    case ORDER_STATUS.RECEIVED:
      return 'bg-neutral-100 text-neutral-800';
    case ORDER_STATUS.IN_KITCHEN:
      return 'bg-accent-gold-100 text-accent-gold-800';
    case ORDER_STATUS.OUT_FOR_DELIVERY:
      return 'bg-primary-100 text-primary-800';
    case ORDER_STATUS.DELIVERED:
      return 'bg-accent-green-100 text-accent-green-800';
    case ORDER_STATUS.CANCELLED:
      return 'bg-error-100 text-error-800';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};
