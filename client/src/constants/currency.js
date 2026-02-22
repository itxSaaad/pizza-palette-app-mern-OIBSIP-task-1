/**
 * Currency Constants
 * 
 * Defines currency codes and symbols used throughout the application.
 * These must match the supported currencies in your payment gateway (Razorpay).
 * 
 * @module constants/currency
 */

/**
 * Default currency code
 * Razorpay test mode and most Indian accounts support INR only
 */
export const DEFAULT_CURRENCY = 'INR';

/**
 * Currency display symbols
 */
export const CURRENCY_SYMBOLS = Object.freeze({
  INR: '₹',
  USD: '$',
});

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - ISO currency code (e.g., 'INR', 'USD')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode = DEFAULT_CURRENCY) => {
  return CURRENCY_SYMBOLS[currencyCode] || CURRENCY_SYMBOLS.INR;
};
