/**
 * Pizza Size Constants
 * 
 * Defines all available pizza sizes with their display labels and price multipliers.
 * Multipliers are used to calculate final price based on base ingredient costs.
 * 
 * NOTE: Keep in sync with backend constants at server/constants/pizzaSizes.js
 * 
 * @constant {Object} PIZZA_SIZES
 */

export const PIZZA_SIZES = Object.freeze({
  SMALL: {
    value: 'small',
    label: 'Small (8")',
    multiplier: 1.0
  },
  MEDIUM: {
    value: 'medium',
    label: 'Medium (10")',
    multiplier: 1.3
  },
  LARGE: {
    value: 'large',
    label: 'Large (12")',
    multiplier: 1.6
  },
  EXTRA_LARGE: {
    value: 'extra-large',
    label: 'Extra Large (14")',
    multiplier: 2.0
  }
});

/**
 * Get all pizza size values as an array
 * @returns {string[]} Array of pizza size values
 */
export const PIZZA_SIZE_VALUES = Object.keys(PIZZA_SIZES).map(key => PIZZA_SIZES[key].value);

/**
 * Get all pizza sizes as array for select options
 * @returns {Array<{value: string, label: string, multiplier: number}>} Array of size options
 */
export const PIZZA_SIZE_OPTIONS = Object.keys(PIZZA_SIZES).map(key => ({
  value: PIZZA_SIZES[key].value,
  label: PIZZA_SIZES[key].label,
  multiplier: PIZZA_SIZES[key].multiplier
}));

/**
 * Get multiplier for a given size
 * @param {string} size - Size value ('small', 'medium', 'large', 'extra-large')
 * @returns {number} Price multiplier
 */
export const getPizzaSizeMultiplier = (size) => {
  const sizeKey = Object.keys(PIZZA_SIZES).find(
    key => PIZZA_SIZES[key].value === size
  );
  return sizeKey ? PIZZA_SIZES[sizeKey].multiplier : 1.0;
};

/**
 * Get label for a given size value
 * @param {string} size - Size value
 * @returns {string} Display label
 */
export const getPizzaSizeLabel = (size) => {
  const sizeKey = Object.keys(PIZZA_SIZES).find(
    key => PIZZA_SIZES[key].value === size
  );
  return sizeKey ? PIZZA_SIZES[sizeKey].label : size;
};
