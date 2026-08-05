const crypto = require('crypto');

/**
 * Generate a random 6-digit numeric code, used for both email-verification
 * codes and password-reset codes. The code is always paired with an
 * expiry and scoped to one account, so DB-wide uniqueness isn't required.
 * @returns {string}
 */
const generateSixDigitCode = () => crypto.randomInt(100000, 1000000).toString();

module.exports = { generateSixDigitCode };
