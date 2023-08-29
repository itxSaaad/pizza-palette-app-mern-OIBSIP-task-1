const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const User = require('../schemas/userSchema');
const Admin = require('../schemas/adminUserSchema');

// Middleware to protect routes - checks for a valid JWT token in the request header
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header with 'Bearer' token is present
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);

      // Find the user in the database using the decoded token
      req.user =
        (await User.findById(decoded.id).select('-password')) ||
        (await Admin.findById(decoded.id).select('-password'));

      // Continue to the next middleware
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not Authorized, Token Failed!');
    }
  }

  // If no token is present
  if (!token) {
    res.status(401);
    throw new Error('Not Authorized, No Token!');
  }
});

// Middleware to check if the user is an admin
const admin = asyncHandler(async (req, res, next) => {
  // Check if the user is authenticated and has admin privileges
  if (req.user && req.user.role === 'admin') {
    // User is an admin, continue to the next middleware
    next();
  } else {
    res.status(401);
    throw new Error('Not Authorized As An Admin!');
  }
});

module.exports = { protect, admin };
