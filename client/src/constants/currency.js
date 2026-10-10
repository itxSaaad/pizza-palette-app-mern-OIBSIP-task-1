/**
 * Currency Constants
 *
 * Defines currency codes and symbols used throughout the application.
 * These must match the supported currencies in your payment gateway (Stripe).
 *
 * @module constants/currency
 */

/**
 * Default currency code — matches the `currency: 'usd'` Stripe Checkout
 * line items are created with server-side.
 */
export const DEFAULT_CURRENCY = 'USD';

/**
 * Currency display symbols
 */
export const CURRENCY_SYMBOLS = Object.freeze({
  USD: '$',
});

/**
 * Get currency symbol for a given currency code
 * @param {string} currencyCode - ISO currency code (e.g., 'USD')
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode = DEFAULT_CURRENCY) => {
  return CURRENCY_SYMBOLS[currencyCode] || CURRENCY_SYMBOLS.USD;
};
