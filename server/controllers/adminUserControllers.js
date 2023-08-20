const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');

// Import Middlewares
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Import Schema
const Admin = require('../schemas/adminUserSchema');

// Initialize Controllers

// @desc    Auth Admin & get token
// @route   POST /api/admin/login
// @access  Public

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      let adminUser = await Admin.findOne({ email: email });

      if (adminUser) {
        if (adminUser.isApproved) {
          const passwordsMatch = await bcrypt.compare(
            password,
            adminUser.password
          );

          if (adminUser.email === email && passwordsMatch) {
            res.json({
              _id: adminUser._id,
              name: adminUser.name,
              email: adminUser.email,
              role: adminUser.role,
              permissions: adminUser.permissions,
              isApproved: adminUser.isApproved,
              token: generateToken(adminUser._id),
              message: 'Login Successful!',
            });
          } else {
            res.status(401);
            throw new Error('Invalid Email or Password!');
          }
        } else {
          res.status(401);
          throw new Error('Your Account is not Approved Yet!');
        }
      } else {
        res.status(401);
        throw new Error('Invalid Email or Password!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email or Password!');
    }
  }
});

// @desc    Register a new Admin
// @route   POST /api/admin/register
// @access  Public

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error('All Fields Are Required!');
  } else {
    if (emailValidator.validate(email)) {
      let adminUser = await Admin.findOne({ email: email });

      if (adminUser) {
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
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = new Admin({
              name: name,
              email: email,
              password: hashedPassword,
              role: 'admin',
              permissions: ['admin'],
              isApproved: false,
            });

            const emailSentToAdmin = await sendEmail(
              (mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: adminUser.email,
                subject: 'Admin Account Created Successfully!',
                text: `Hello ${name},\n\nYour Admin Account has been created successfully. Please wait for the Admin to approve your account.\n\nThank You,\nTeam Pizza Delivery!`,
              })
            );

            const emailSentToSuperAdmin = await sendEmail(
              (mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: process.env.NODEMAILER_SUPERADMIN_EMAIL,
                subject: 'New Admin Account Approval!',
                text: `Hello Super Admin,\n\nA new Admin Account has been created successfully. Please approve the account.\n\nThank You,\nTeam Pizza Delivery!`,
              })
            );

            if (emailSentToAdmin && emailSentToSuperAdmin) {
              const savedAdmin = await newAdmin.save();

              if (savedAdmin) {
                res.status(201).json({
                  _id: savedAdmin._id,
                  name: savedAdmin.name,
                  email: savedAdmin.email,
                  role: savedAdmin.role,
                  permissions: savedAdmin.permissions,
                  isApproved: savedAdmin.isApproved,
                  token: generateToken(savedAdmin._id),
                  message: 'Admin Created Successfully!',
                });
              } else {
                res.status(500);
                throw new Error('Internal Server Error!');
              }
            }
          }
        }
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email or Password!');
    }
  }
});

// Export Controllers
module.exports = { authAdmin, registerAdmin };
