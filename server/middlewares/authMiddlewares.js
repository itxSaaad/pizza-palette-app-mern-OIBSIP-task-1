const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../schemas/userSchema');
const Admin = require('../schemas/adminUserSchema');
const ApiError = require('../utils/ApiError');
const { isAdminRole } = require('../constants/userRoles');

// Middleware to protect routes - checks for a valid JWT token in the request header
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw ApiError.unauthorized('You need to be logged in to do that.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (error) {
    throw ApiError.unauthorized('Your session has expired. Please log in again.');
  }

  // Find the user in the database using the decoded token
  req.user =
    (await User.findById(decoded.id).select('-password')) ||
    (await Admin.findById(decoded.id).select('-password'));

  if (!req.user) {
    throw ApiError.unauthorized('Your account could not be found. Please log in again.');
  }

  return next();
});

// Middleware to check if the user is an admin (or manager)
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && isAdminRole(req.user.role)) {
    // Re-check isApproved on every request, not just at login — an admin
    // whose approval is revoked should lose access immediately, not just
    // once their existing JWT happens to expire.
    if (req.user.isApproved === false) {
      throw ApiError.accountNotApproved();
    }

    return next();
  }

  throw ApiError.forbidden("You don't have permission to access this resource.");
});

module.exports = { protect, admin };
