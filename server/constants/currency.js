/**
 * Currency Constants
 *
 * Defines currency codes used throughout the application.
 * These must match the supported currencies in your payment gateway (Stripe).
 *
 * @module constants/currency
 */

/**
 * Default currency code — matches the `currency: 'usd'` Stripe Checkout
 * line items are created with in orderControllers.js.
 */
const DEFAULT_CURRENCY = 'USD';

/**
 * Supported currencies
 * Add more currencies here if you enable additional currencies in Stripe.
 */
const SUPPORTED_CURRENCIES = Object.freeze([
  'USD', // US Dollar
]);

module.exports = {
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
};
