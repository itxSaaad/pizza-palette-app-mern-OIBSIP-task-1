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
            res.status(200).json({
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
              role: 'manager',
              permissions: ['manager'],
              isApproved: false,
            });

            const emailSentToAdmin = await sendEmail(
              (mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: adminUser.email,
                subject: 'Admin Account Created Successfully!',
                text: `Hello ${name},\n\nYour Admin Account has been created successfully. Please wait for the Admin to approve your account.\n\nThank You,\nTeam Pizza Delivery!`,
              })
            );

            const emailSentToSuperAdmin = await sendEmail(
              (mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: process.env.SUPERADMIN_EMAIL,
                subject: 'New Admin Account Approval!',
                text: `Hello Super Admin,\n\nA new Admin Account has been created successfully. Please approve the account.\n\nThank You,\nTeam Pizza Delivery!`,
              })
            );

            if (emailSentToAdmin && emailSentToSuperAdmin) {
              const savedAdmin = await newAdmin.save();

              if (savedAdmin) {
                res.status(200).json({
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

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
// @access  Private

const getAdminProfile = asyncHandler(async (req, res) => {
  const adminUser = await Admin.findById(req.user._id);

  if (adminUser) {
    res.status(200).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions,
      isApproved: adminUser.isApproved,
    });
  } else {
    res.status(404);
    throw new Error('Admin Not Found!');
  }
});

// @desc    Update Admin Profile
// @route   PUT /api/admin/profile
// @access  Private

const updateAdminProfile = asyncHandler(async (req, res) => {
  const adminUser = await Admin.findById(req.user._id);

  if (adminUser) {
    let { name, email, password, confirmPassword } = req.body;

    if (emailValidator.validate(email)) {
      let match = false;

      if (password !== '') {
        match = await bcrypt.compare(password, adminUser.password);
      }

      if (adminUser.email === email && match) {
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
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);

              adminUser.password = hashedPassword;
            }

            adminUser.name = name || adminUser.name;
            adminUser.email = email || adminUser.email;

            const updatedAdmin = await adminUser.save();

            if (updatedAdmin) {
              res.status(200).json({
                _id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                permissions: updatedAdmin.permissions,
                isApproved: updatedAdmin.isApproved,
                token: generateToken(updatedAdmin._id),
                message: 'Admin Updated Successfully!',
              });
            } else {
              res.status(500);
              throw new Error('Error Updating Admin Profile!');
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
    throw new Error('Admin Not Found!');
  }
});

// @desc    Get All Admins
// @route   GET /api/admin
// @access  Private/Admin

const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find({});

  if (admins) {
    res.status(200);
    res.json(admins);
  } else {
    res.status(404);
    throw new Error('No Admins Found!');
  }
});

// @desc    Get Admin By ID
// @route   GET /api/admin/:id
// @access  Private/Admin

const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password');

  if (admin) {
    res.status(200);
    res.json(admin);
  } else {
    res.status(404);
    throw new Error('Admin Not Found!');
  }
});

// @desc    Update Admin By Id
// @route   PUT /api/admin/:id
// @access  Private/Admin

const updateAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);

  if (admin) {
    let { name, email, role, permissions, isApproved } = req.body;

    if (emailValidator.validate(email)) {
      if (admin.email !== email && email !== '') {
        admin.email = email;
      }

      if (admin.name !== name && name !== '') {
        admin.name = name;
      }

      if (admin.role !== role && role !== '') {
        admin.role = role;
      }

      if (admin.permissions !== permissions && permissions !== '') {
        admin.permissions = permissions;
      }

      if (admin.isApproved !== isApproved && isApproved !== '') {
        admin.isApproved = isApproved;
      }

      const updatedAdmin = await admin.save();

      if (updatedAdmin) {
        res.status(200).json({
          _id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
          permissions: updatedAdmin.permissions,
          isApproved: updatedAdmin.isApproved,
          message: 'Admin Updated Successfully!',
        });
      } else {
        res.status(500);
        throw new Error('Error Updating Admin!');
      }
    } else {
      res.status(400);
      throw new Error('Invalid Email!');
    }
  } else {
    res.status(404);
    throw new Error('Admin Not Found!');
  }
});

// @desc    Delete Admin By Id
// @route   DELETE /api/admin/:id
// @access  Private/Admin

const deleteAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);

  if (admin) {
    res.status(200).json({ message: 'Admin Deleted Successfully!' });
  } else {
    res.status(404);
    throw new Error('Admin Not Found!');
  }
});

// Export Controllers
module.exports = {
  authAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
