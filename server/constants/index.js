/**
 * Constants Index
 * 
 * Central export for all application constants.
 * 
 * IMPORTANT: These constants are duplicated in the frontend at client/src/constants/
 * When updating values here, make sure to update the frontend constants as well to keep them in sync.
 * 
 * @module constants
 */

const { ORDER_STATUS, ORDER_STATUS_VALUES } = require('./orderStatus');
const { PIZZA_SIZES, PIZZA_SIZE_VALUES, getPizzaSizeMultiplier } = require('./pizzaSizes');
const { INVENTORY_TYPES, isValidInventoryType } = require('./inventoryTypes');
const { PAYMENT_METHODS, PAYMENT_STATUS, PAYMENT_STATUS_VALUES, STRIPE_EVENTS } = require('./paymentConstants');
const { USER_ROLES, USER_ROLE_VALUES, ADMIN_ROLES, isAdminRole } = require('./userRoles');
const { ERROR_CODES } = require('./errorCodes');

module.exports = {
  // Order Status
  ORDER_STATUS,
  ORDER_STATUS_VALUES,
  
  // Pizza Sizes
  PIZZA_SIZES,
  PIZZA_SIZE_VALUES,
  getPizzaSizeMultiplier,
  
  // Inventory Types
  INVENTORY_TYPES,
  isValidInventoryType,
  
  // Payment
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_VALUES,
  STRIPE_EVENTS,
  
  // User Roles
  USER_ROLES,
  USER_ROLE_VALUES,
  ADMIN_ROLES,
  isAdminRole,
  
  // Error Codes
  ERROR_CODES
};
