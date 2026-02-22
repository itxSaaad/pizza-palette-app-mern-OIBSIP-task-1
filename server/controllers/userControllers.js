const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');
const { parsePaginationParams, parseSortParams, buildPaginationResponse } = require('../utils/paginationUtils');

// Import Middlewares
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Import Schema
const User = require('../schemas/userSchema');

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

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        orders: user.orders,
        isVerified: user.isVerified,
        token: generateToken(user._id),
        message: 'Login Successful!',
      });
    } else {
      res.status(401);
      throw new Error('Invalid Email or Password!');
    }
  } else {
    res.status(401);
    throw new Error('Invalid Email or Password!');
  }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

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
      actionText: 'Verify Email'
    },
  });

  if (!emailSent) {
    res.status(400);
    throw new Error('Error Sending Confirmation Code!');
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
    res.status(400);
    throw new Error('Invalid Email Address!');
  }

  if (user.verificationCode !== verificationCode) {
    res.status(400);
    throw new Error('Invalid Confirmation Code!');
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

// @desc Forgot Password
// @route POST /api/users/forgotpassword
// @access Public

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('Invalid Email Address!');
  }

  const resetToken = await generateVerificationCode();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 600000;
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const emailSent = await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    templateOptions: {
      title: 'Password Reset Request',
      greeting: `Hi ${user.name || ''},`,
      message: `You requested a password reset.<br><br><b>Your reset code:</b> <span style="font-size:1.3em;letter-spacing:2px;background:#f3f3f3;padding:4px 12px;border-radius:4px;">${resetToken}</span><br><br>Please use this code within the next 10 minutes to reset your password, or click the button below to reset your password directly.`,
      actionUrl: resetUrl,
      actionText: 'Reset Password'
    },
  });

  if (!emailSent) {
    res.status(400);
    throw new Error('Error Sending Password Reset Email!');
  }

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    orders: user.orders,
    isVerified: user.isVerified,
    token: generateToken(user._id),
    message: 'Password Reset Email Sent Successfully!',
  });
});

// @desc Reset Password
// @route POST /api/users/resetpassword
// @access Public

const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  if (user.resetPasswordExpire <= Date.now()) {
    res.status(400);
    throw new Error('Reset Token Expired!');
  }

  if (user.resetPasswordToken !== resetToken) {
    res.status(400);
    throw new Error('Invalid Reset Token!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

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
    message: 'Password Reset Successful!',
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
    res.status(404);
    throw new Error('User Not Found!');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  const { name, email, phoneNumber, address, password } = req.body;

  if (password && password !== '') {
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
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
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-password -verificationCode -resetPasswordToken -__v'),
    User.countDocuments(filter)
  ]);

  res.status(200).json(buildPaginationResponse(users, total, page, limit));
});

// @desc    Get User by ID
// @route   GET /api/users/:id
// @access  Private/Admin

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User Not Found!');
  }
});

// @desc    Update User By ID
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
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
    res.status(404);
    throw new Error('User Not Found!');
  }
});

// Export Controllers
module.exports = {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
