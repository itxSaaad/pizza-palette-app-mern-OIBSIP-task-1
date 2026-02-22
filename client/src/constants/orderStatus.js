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
      return 'bg-blue-100 text-blue-800';
    case ORDER_STATUS.IN_KITCHEN:
      return 'bg-yellow-100 text-yellow-800';
    case ORDER_STATUS.OUT_FOR_DELIVERY:
      return 'bg-purple-100 text-purple-800';
    case ORDER_STATUS.DELIVERED:
      return 'bg-green-100 text-green-800';
    case ORDER_STATUS.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
