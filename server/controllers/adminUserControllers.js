const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');
const { USER_ROLES } = require('../constants');

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

  const adminUser = await Admin.findOne({ email });

  if (!adminUser) {
    res.status(401);
    throw new Error('Invalid Email or Password!');
  }

  if (!adminUser.isApproved) {
    res.status(401);
    throw new Error('Your Account is not Approved Yet!');
  }

  const passwordsMatch = await bcrypt.compare(password, adminUser.password);

  if (!passwordsMatch) {
    res.status(401);
    throw new Error('Invalid Email or Password!');
  }

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
});

// @desc    Register a new Admin
// @route   POST /api/admin/register
// @access  Public

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('User Already Exists!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newAdmin = new Admin({
    name,
    email,
    password: hashedPassword,
    role: USER_ROLES.MANAGER,
    permissions: [USER_ROLES.MANAGER],
    isApproved: false,
  });

  const emailSentToAdmin = await sendEmail({
    to: email,
    subject: 'Admin Account Created Successfully!',
    templateOptions: {
      title: 'Admin Account Created',
      greeting: `Hello ${name},`,
      message: `Your Admin Account has been created successfully.<br><br>Please wait for the Super Admin to approve your account.`,
    },
  });

  const emailSentToSuperAdmin = await sendEmail({
    to: process.env.SUPERADMIN_EMAIL,
    subject: 'New Admin Account Approval!',
    templateOptions: {
      title: 'New Admin Account Approval',
      greeting: `Hello Super Admin,`,
      message: `A new Admin Account for <b>${name} (${email})</b> has been created.<br><br>Please review and approve the account.`,
    },
  });

  if (!emailSentToAdmin || !emailSentToSuperAdmin) {
    res.status(400);
    throw new Error('Error Sending Emails!');
  }

  const savedAdmin = await newAdmin.save();

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

  if (!adminUser) {
    res.status(404);
    throw new Error('Admin Not Found!');
  }

  const { name, email, password } = req.body;

  if (password && password !== '') {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    adminUser.password = hashedPassword;
  }

  adminUser.name = name || adminUser.name;
  adminUser.email = email || adminUser.email;

  const updatedAdmin = await adminUser.save();

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

  if (!admin) {
    res.status(404);
    throw new Error('Admin Not Found!');
  }

  const { name, email, role, permissions, isApproved } = req.body;

  admin.name = name || admin.name;
  admin.email = email || admin.email;
  admin.role = role || admin.role;
  admin.permissions = permissions || admin.permissions;
  
  if (isApproved !== undefined) {
    admin.isApproved = isApproved;
  }

  const updatedAdmin = await admin.save();

  res.status(200).json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    role: updatedAdmin.role,
    permissions: updatedAdmin.permissions,
    isApproved: updatedAdmin.isApproved,
    message: 'Admin Updated Successfully!',
  });
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
