const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');
const {
  parsePaginationParams,
  parseSortParams,
  buildPaginationResponse,
} = require('../utils/paginationUtils');
const { hashPassword } = require('../utils/passwordUtils');
const ApiError = require('../utils/ApiError');

// Import Middlewares
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Import Schema
const User = require('../schemas/userSchema');
const Admin = require('../schemas/adminUserSchema');

// Function to generate a random 6-digit confirmation code thats not in users Schema already
const generateVerificationCode = async () => {
  let code;
  let user;

  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    user = await User.findOne({ verificationCode: code });
  } while (user);

  return code;
};

// Initialize Controllers

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw ApiError.emailExists();
  }

  // Unified login/forgot-password resolves an email across User + Admin —
  // an email already used by a staff account can't also become a customer.
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    throw ApiError.emailExists(
      'An account with this email already exists. Try logging in instead.'
    );
  }

  const hashedPassword = await hashPassword(password);

  const verificationCode = await generateVerificationCode();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationCode}`;

  const emailSent = await sendEmail({
    to: email,
    subject: 'Please Confirm your Account!',
    templateOptions: {
      title: 'Confirm Your Account',
      greeting: `Hey ${name},`,
      message: `Account Successfully Created!<br><br><b>Your verification code:</b> <span style="font-size:1.3em;letter-spacing:2px;background:#f3f3f3;padding:4px 12px;border-radius:4px;">${verificationCode}</span><br><br>Please use this code within the next 10 minutes to activate your account, or click the button below to verify your email automatically.<br><br>P.S. If you did not create an account, please ignore this email.`,
      actionUrl: verifyUrl,
      actionText: 'Verify Email',
    },
  });

  if (!emailSent) {
    throw ApiError.emailSendFailed(
      'We could not send your confirmation code. Please try registering again.'
    );
  }

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
    address,
    verificationCode,
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    orders: user.orders,
    isVerified: user.isVerified,
    token: generateToken(user._id),
    message: 'User Registered Successfully!',
  });
});

// @desc    Verify a user
// @route   POST /api/users/verify
// @access  Public

const verifyUser = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;

  const user = await User.findOne({ email, _id: req.user._id });

  if (!user) {
    throw ApiError.validation('We could not find an account with that email address.');
  }

  if (user.verificationCode !== verificationCode) {
    throw ApiError.validation('That confirmation code is incorrect or has expired.');
  }

  user.isVerified = true;
  user.verificationCode = null;

  const verifiedUser = await user.save();

  res.status(200).json({
    _id: verifiedUser._id,
    name: verifiedUser.name,
    email: verifiedUser.email,
    phoneNumber: verifiedUser.phoneNumber,
    address: verifiedUser.address,
    orders: verifiedUser.orders,
    isVerified: verifiedUser.isVerified,
    token: generateToken(verifiedUser._id),
    message: 'User Verified Successfully!',
  });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      orders: user.orders,
      isVerified: user.isVerified,
      message: 'User Profile Fetched Successfully!',
    });
  } else {
    throw ApiError.notFound('User');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  const { name, email, phoneNumber, address, password } = req.body;

  if (password && password !== '') {
    user.password = await hashPassword(password);
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    address: updatedUser.address,
    orders: updatedUser.orders,
    isVerified: updatedUser.isVerified,
    token: generateToken(updatedUser._id),
    message: 'User Profile Updated Successfully!',
  });
});

// @desc    Get all Users
// @route   GET /api/users
// @access  Private/Admin

const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, '-createdAt');

  // Build filter
  const filter = {};
  if (req.query.isVerified !== undefined) {
    filter.isVerified = req.query.isVerified === 'true';
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password -verificationCode -resetPasswordToken -__v'),
    User.countDocuments(filter),
  ]);

  res.status(200).json(buildPaginationResponse(users, total, page, limit));
});

// @desc    Get User by ID
// @route   GET /api/users/:id
// @access  Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    '-password -verificationCode -resetPasswordToken -resetPasswordExpire -__v'
  );

  if (user) {
    res.status(200).json(user);
  } else {
    throw ApiError.notFound('User');
  }
});

// @desc    Update User By ID
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw ApiError.notFound('User');
  }

  const { name, email, phoneNumber, address } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    address: updatedUser.address,
    orders: updatedUser.orders,
    isVerified: updatedUser.isVerified,
    token: generateToken(updatedUser._id),
    message: 'User Updated Successfully!',
  });
});

// @desc    Delete a User By Id
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user) {
    res.status(200).json({ message: 'User Removed Successfully!' });
  } else {
    throw ApiError.notFound('User');
  }
});

// Export Controllers
module.exports = {
  registerUser,
  verifyUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
