const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');

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

  if (!email || !password) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      let user = await User.findOne({ email: email });

      if (user) {
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (user.email === email && passwordsMatch) {
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

            // Generate a verification token
            const verificationCode = await generateVerificationCode();

            // Send the verification email
            const emailSent = await sendEmail(
              (mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Please Confirm your Account!',
                text: `Hey ${name},\n\nAccount Successfully Created!\n\nPlease use the following code within the next 10 minutes to activate your account: ${verificationCode}\n\nThanks,\nTeam Pizza Palette.\n\nP.S. If you did not create an account, please ignore this email. `,
              })
            );

            if (emailSent) {
              user = await User.create({
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
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      const user = await User.findOne({ email, _id: req.user._id });

      if (user) {
        if (user.verificationCode === verificationCode) {
          user.isVerified = true;
          user.verificationCode = null;

          const verifiedUser = await user.save();

          if (verifiedUser) {
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
        const resetToken = generateverificationCode();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 600000; // 10 minutes

        // Send the reset email
        const emailSent = await sendEmail(
          (mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            text: `Please use the following code within the next 10 minutes to reset your password: ${resetToken}`,
          })
        );

        if (emailSent) {
          const resetUserPwd = await user.save();

          if (resetUserPwd) {
            res.status(200).json({
              _id: resetUserPwd._id,
              name: resetUserPwd.name,
              email: resetUserPwd.email,
              phoneNumber: resetUserPwd.phoneNumber,
              address: resetUserPwd.address,
              orders: resetUserPwd.orders,
              isVerified: resetUserPwd.isVerified,
              token: generateToken(resetUserPwd._id),
              message: 'Password Reset Email Sent Successfully!',
            });
          } else {
            res.status(400);
            throw new Error('Error Updating User!');
          }
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
      });

      if (user) {
        if (user.resetPasswordExpire > Date.now()) {
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
          res.status(400);
          throw new Error('Reset Token Expired!');
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

  if (user) {
    let { name, email, phoneNumber, address, password, confirmPassword } =
      req.body;

    if (emailValidator.validate(email)) {
      let match = false;

      if (password !== '') {
        match = await bcrypt.compare(password, user.password);
      }

      if (user.email === email && match) {
        res.status(400);
        throw new Error('You Have Not Made Any Changes!');
      } else {
        if (password !== '' && password !== confirmPassword) {
          res.status(400);
          throw new Error('Passwords Do Not Match!');
        } else {
          if (password.length < 8) {
            res.status(400);
            throw new Error('Password Must Be At Least 8 Characters Long!');
          } else {
            if (password !== '') {
              const salt = await bcrypt.genSalt(Number(process.env.SALT));
              const hashedPassword = await bcrypt.hash(password, salt);
              user.password = hashedPassword;
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.address = address || user.address;

            const updatedUser = await user.save();

            if (updatedUser) {
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
            } else {
              res.status(400);
              throw new Error('Error Updating User Profile!');
            }
          }
        }
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email or Password!');
    }
  } else {
    res.status(404);
    throw new Error('User Not Found!');
  }
});

// @desc    Get all Users
// @route   GET /api/users
// @access  Private/Admin

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('Users Not Found!');
  }
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

  if (user) {
    let { name, email, phoneNumber, address } = req.body;

    if (emailValidator.validate(email)) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;

      const updatedUser = await user.save();

      if (updatedUser) {
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
      } else {
        res.status(400);
        throw new Error('Error Updating User!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email Address!');
    }
  } else {
    res.status(404);
    throw new Error('User Not Found!');
  }
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
