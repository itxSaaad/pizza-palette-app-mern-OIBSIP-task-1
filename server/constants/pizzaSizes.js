/**
 * Pizza Size Constants
 * 
 * Defines all available pizza sizes with their display labels and price multipliers.
 * Multipliers are used to calculate final price based on base ingredient costs.
 * 
 * @constant {Object} PIZZA_SIZES
 */

const PIZZA_SIZES = Object.freeze({
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
const PIZZA_SIZE_VALUES = Object.keys(PIZZA_SIZES).map(key => PIZZA_SIZES[key].value);

/**
 * Get multiplier for a given size
 * @param {string} size - Size value ('small', 'medium', 'large', 'extra-large')
 * @returns {number} Price multiplier
 */
const getPizzaSizeMultiplier = (size) => {
  const sizeKey = Object.keys(PIZZA_SIZES).find(
    key => PIZZA_SIZES[key].value === size
  );
  return sizeKey ? PIZZA_SIZES[sizeKey].multiplier : 1.0;
};

module.exports = {
  PIZZA_SIZES,
  PIZZA_SIZE_VALUES,
  getPizzaSizeMultiplier
};
