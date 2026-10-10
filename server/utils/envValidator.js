/**
 * Validate required environment variables
 * @throws {Error} If any required variable is missing
 */
const validateEnv = () => {
  // This list matches variable names in .env and .env.example
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'SALT',
    'SENDER_EMAIL',
    'SENDER_PASSWORD',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NODE_ENV',
    'PORT',
    'FRONTEND_URL',
  ];

  const missing = [];

  required.forEach((variable) => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        `Please check your .env file and ensure all required variables are set.`
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      '⚠️  WARNING: JWT_SECRET should be at least 32 characters long for better security'
    );
  }

  // Validate SALT is a usable bcrypt cost factor — every password-hashing
  // call site reads this instead of hardcoding its own value, so a bad
  // value here would otherwise only surface as a cryptic bcrypt error at
  // the first registration/password-change request.
  const saltRounds = Number(process.env.SALT);
  if (!Number.isInteger(saltRounds) || saltRounds < 4 || saltRounds > 15) {
    throw new Error('SALT must be an integer between 4 and 15 (bcrypt cost factor).');
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = { validateEnv };
