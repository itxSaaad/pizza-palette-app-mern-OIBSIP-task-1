/**
 * Order Status Constants
 * 
 * Defines all possible order statuses in the system.
 * These values are used in schemas, validators, and controllers.
 * 
 * @constant {Object} ORDER_STATUS
 */

const ORDER_STATUS = Object.freeze({
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
const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

module.exports = {
  ORDER_STATUS,
  ORDER_STATUS_VALUES
};
