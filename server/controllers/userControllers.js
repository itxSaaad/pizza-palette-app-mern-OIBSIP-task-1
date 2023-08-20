const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// Import Utils
const generateToken = require('../utils/generateToken');

// Import Schema
const User = require('../schemas/userSchema');
const { reset } = require('nodemon');

// NodeMailer Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  requireTLS: true,
  auth: {
    // Enter your email address and password here
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Function to generate a random 6-digit confirmation code
const generateConfirmationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Initialize Controllers

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      let user = await User.findOne({ email: email });

      if (user != null) {
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (user.email === email && passwordsMatch) {
          res.json({
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
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, confirmPassword, phoneNumber, address } =
    req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(req.body.email)) {
      let user = await User.findOne({ email: email });

      if (user) {
        res.status(400);
        throw new Error('User Already Exists!');
      } else {
        if (password !== confirmPassword) {
          res.status(400);
          throw new Error('Passwords Do Not Match!');
        } else {
          if (password.length < 8) {
            res.status(400);
            throw new Error('Password Must Be At Least 8 Characters Long!');
          } else {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
              name,
              email,
              password: hashedPassword,
              phoneNumber,
              address,
            });

            // Generate a verification token
            const confirmationCode = generateConfirmationCode();
            user.verificationToken = confirmationCode;

            // Send the verification email
            const mailOptions = {
              from: process.env.NODEMAILER_EMAIL,
              to: user.email,
              subject: 'Please Confirm your Account!',
              text: `Please use the following code within the next 10 minutes to confirm your account: ${confirmationCode}`,
            };

            const emailSent = await transporter.sendMail(mailOptions);

            if (emailSent) {
              await user.save();
              res.status(201).json({
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
            } else {
              res.status(400);
              throw new Error('Error Sending Confirmation Code!');
            }
          }
        }
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  }
});

// @desc    Verify a user
// @route   POST /api/users/verify
// @access  Public

const verifyUser = asyncHandler(async (req, res) => {
  const { email, confirmationCode } = req.body;

  if (!email || !confirmationCode) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      const user = await User.findOne({ email, confirmationCode });

      if (user) {
        if (user.confirmationCode === confirmationCode) {
          user.isVerified = true;
          user.confirmationCode = '';

          const verifiedUser = await user.save();

          if (verifiedUser) {
            res.status(201).json({
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
          } else {
            res.status(400);
            throw new Error('Error Verifying User!');
          }
        } else {
          res.status(400);
          throw new Error('Invalid Confirmation Code!');
        }
      } else {
        res.status(400);
        throw new Error('Invalid Email Address!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  }
});

// @desc Forgot Password
// @route POST /api/users/forgotpassword
// @access Public

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email Address Is Required!');
  } else {
    if (emailValidator.validate(email)) {
      const user = await User.findOne({ email });

      if (user) {
        // Generate a reset token
        const resetToken = generateConfirmationCode();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 600000; // 10 minutes

        // Send the reset email
        const mailOptions = {
          from: process.env.NODEMAILER_EMAIL,
          to: user.email,
          subject: 'Password Reset Request',
          text: `Please use the following code within the next 10 minutes to reset your password: ${resetToken}`,
        };

        const emailSent = await transporter.sendMail(mailOptions);

        if (emailSent) {
          await user.save();
          res.status(201).json({
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
        } else {
          res.status(400);
          throw new Error('Error Sending Password Reset Email!');
        }
      } else {
        res.status(400);
        throw new Error('Invalid Email Address!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  }
});

// @desc Reset Password
// @route POST /api/users/resetpassword
// @access Public

const resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, newPassword, confirmNewPassword } = req.body;

  if (!email || !resetToken || !newPassword || !confirmNewPassword) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      const user = await User.findOne({
        email,
        resetPasswordToken: resetToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (user) {
        if (user.resetPasswordToken === resetToken) {
          if (newPassword !== confirmNewPassword) {
            res.status(400);
            throw new Error('Passwords Do Not Match!');
          } else {
            if (newPassword.length < 8) {
              res.status(400);
              throw new Error('Password Must Be At Least 8 Characters Long!');
            } else {
              const salt = await bcrypt.genSalt(10);
              hashedPassword = await bcrypt.hash(newPassword, salt);

              user.password = hashedPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpire = undefined;

              const updatedUser = await user.save();

              if (updatedUser) {
                res.status(201).json({
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
              } else {
                res.status(400);
                throw new Error('Error Resetting Password!');
              }
            }
          }
        } else {
          res.status(400);
          throw new Error('Invalid Reset Token!');
        }
      } else {
        res.status(404);
        throw new Error('User Not Found!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  }
});

module.exports = {
  authUser,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
};
