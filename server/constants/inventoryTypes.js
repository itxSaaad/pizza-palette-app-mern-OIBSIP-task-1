/**
 * Inventory Type Constants
 * 
 * Defines all types of inventory items available in the system.
 * These correspond to separate MongoDB collections (Base, Sauce, Cheese, Veggie).
 * 
 * @constant {string[]} INVENTORY_TYPES
 */

const INVENTORY_TYPES = Object.freeze(['Base', 'Sauce', 'Cheese', 'Veggie']);

/**
 * Check if a given type is valid
 * @param {string} type - Inventory type to validate
 * @returns {boolean} True if valid type
 */
const isValidInventoryType = (type) => {
  return INVENTORY_TYPES.includes(type);
};

module.exports = {
  INVENTORY_TYPES,
  isValidInventoryType
};
