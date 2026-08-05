const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');
const { generateSixDigitCode } = require('../utils/authUtils');
const ApiError = require('../utils/ApiError');

// Import Middlewares
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Import Schemas
const User = require('../schemas/userSchema');
const Admin = require('../schemas/adminUserSchema');

// A single login entry point for both customers and admin/manager accounts.
// The email is looked up in User first, then Admin (same resolution order
// `protect` already uses), so the client never has to know the account type
// up front.

// @desc    Log in (customer or admin/manager)
// @route   POST /api/auth/login
// @access  Public

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Registration/invite/setup all now reject an email that's already used
  // by the other account type, so a User and Admin sharing an email
  // shouldn't happen going forward. But a User password mismatch doesn't
  // necessarily mean invalid credentials for any legacy duplicate that
  // predates that enforcement — fall through and try Admin too rather than
  // failing fast, so we never mask a legitimate admin login.
  if (user) {
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      return res.status(200).json({
        type: 'user',
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
    }
  }

  const admin = await Admin.findOne({ email });

  if (admin) {
    if (!admin.isApproved) {
      throw ApiError.accountNotApproved();
    }

    const passwordsMatch = await bcrypt.compare(password, admin.password);

    if (passwordsMatch) {
      return res.status(200).json({
        type: 'admin',
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isApproved: admin.isApproved,
        token: generateToken(admin._id),
        message: 'Login Successful!',
      });
    }
  }

  throw ApiError.invalidCredentials();
});

// @desc    Request a password reset code (customer or admin/manager)
// @route   POST /api/auth/forgotpassword
// @access  Public

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const account = (await User.findOne({ email })) || (await Admin.findOne({ email }));

  if (!account) {
    throw ApiError.validation('We could not find an account with that email address.');
  }

  const resetToken = generateSixDigitCode();
  account.resetPasswordToken = resetToken;
  account.resetPasswordExpire = Date.now() + 600000;

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const emailSent = await sendEmail({
    to: account.email,
    subject: 'Password Reset Request',
    templateOptions: {
      title: 'Password Reset Request',
      greeting: `Hi ${account.name || ''},`,
      message: `You requested a password reset.<br><br><b>Your reset code:</b> <span style="font-size:1.3em;letter-spacing:2px;background:#f3f3f3;padding:4px 12px;border-radius:4px;">${resetToken}</span><br><br>Please use this code within the next 10 minutes to reset your password, or click the button below to reset your password directly.`,
      actionUrl: resetUrl,
      actionText: 'Reset Password',
    },
  });

  if (!emailSent) {
    throw ApiError.emailSendFailed(
      'We could not send your password reset email. Please try again.'
    );
  }

  await account.save();

  res.status(200).json({
    email: account.email,
    message: 'Password Reset Email Sent Successfully!',
  });
});

// @desc    Reset password using a code from forgotPassword (customer or admin/manager)
// @route   PUT /api/auth/resetpassword
// @access  Public

const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  const account = (await User.findOne({ email })) || (await Admin.findOne({ email }));

  if (!account) {
    throw ApiError.notFound('Account');
  }

  if (!resetToken || !account.resetPasswordToken || !account.resetPasswordExpire) {
    throw ApiError.validation('This password reset link is invalid. Please request a new one.');
  }

  if (account.resetPasswordExpire <= Date.now()) {
    throw ApiError.validation('This password reset link has expired. Please request a new one.');
  }

  if (account.resetPasswordToken !== resetToken) {
    throw ApiError.validation('This password reset link is invalid. Please request a new one.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  account.password = hashedPassword;
  account.resetPasswordToken = undefined;
  account.resetPasswordExpire = undefined;

  await account.save();

  res.status(200).json({
    email: account.email,
    message: 'Password Reset Successful!',
  });
});

module.exports = { login, forgotPassword, resetPassword };
