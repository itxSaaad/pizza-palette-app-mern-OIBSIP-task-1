const ApiError = require('../utils/ApiError');

// Vercel's serverless functions can't host a long-running node-cron timer
// (the process is torn down between invocations), so scheduled work in
// production is triggered externally by Vercel Cron Jobs instead — see
// server/vercel.json's `crons` entry. Vercel automatically sends
// `Authorization: Bearer <CRON_SECRET>` on those requests when CRON_SECRET
// is set in the project's environment variables. This middleware verifies
// that shared secret instead of requiring a full admin JWT, since a cron
// invocation has no user session to authenticate with.
const verifyCronSecret = (req, res, next) => {
  if (!process.env.CRON_SECRET) {
    throw ApiError.serverError('Scheduled task endpoint is not configured.');
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw ApiError.unauthorized('Invalid or missing cron secret.');
  }

  return next();
};

module.exports = { verifyCronSecret };
