const crypto = require('crypto');

const INVITE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a random invite token and its SHA-256 hash.
 * The raw token is what gets emailed/put in the URL; only the hash is stored.
 * @returns {{ rawToken: string, tokenHash: string, expiresAt: Date }}
 */
const createInviteToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_MS);
  return { rawToken, tokenHash, expiresAt };
};

const hashInviteToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = { createInviteToken, hashInviteToken };
