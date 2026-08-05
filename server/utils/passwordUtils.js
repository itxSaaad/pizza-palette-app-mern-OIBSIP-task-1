const bcrypt = require('bcryptjs');

/**
 * Hash a plaintext password using the configured bcrypt cost factor.
 * Single source of truth for salt rounds — previously some call sites
 * hardcoded `bcrypt.genSalt(10)` while others read `process.env.SALT`,
 * which could silently diverge if SALT changed.
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return bcrypt.hash(plainPassword, salt);
};

module.exports = { hashPassword };
