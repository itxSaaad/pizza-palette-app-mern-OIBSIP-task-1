/**
 * Inventory Type Constants
 * 
 * Defines all types of inventory items available in the system.
 * 
 * NOTE: Keep in sync with backend constants at server/constants/inventoryTypes.js
 * 
 * @constant {string[]} INVENTORY_TYPES
 */

export const INVENTORY_TYPES = Object.freeze(['Base', 'Sauce', 'Cheese', 'Veggie']);

/**
 * Check if a given type is valid
 * @param {string} type - Inventory type to validate
 * @returns {boolean} True if valid type
 */
export const isValidInventoryType = (type) => {
  return INVENTORY_TYPES.includes(type);
};

/**
 * Get inventory types as select options
 * @returns {Array<{value: string, label: string}>} Array of type options
 */
export const INVENTORY_TYPE_OPTIONS = INVENTORY_TYPES.map(type => ({
  value: type,
  label: type
}));
