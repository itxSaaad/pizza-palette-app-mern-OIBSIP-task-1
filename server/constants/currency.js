/**
 * Currency Constants
 * 
 * Defines currency codes used throughout the application.
 * These must match the supported currencies in your payment gateway (Razorpay).
 * 
 * @module constants/currency
 */

/**
 * Default currency code
 * Razorpay test mode and most Indian accounts support INR only
 */
const DEFAULT_CURRENCY = 'INR';

/**
 * Supported currencies
 * Add more currencies here if your Razorpay account supports them
 */
const SUPPORTED_CURRENCIES = Object.freeze([
  'INR', // Indian Rupee (required for Razorpay test mode)
]);

module.exports = {
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
};
