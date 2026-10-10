const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

// Import Utils
const generateToken = require('../utils/generateToken');
const { hashPassword } = require('../utils/passwordUtils');
const { USER_ROLES } = require('../constants');
const ApiError = require('../utils/ApiError');
const {
  aggregatePaginated,
  parsePaginationParams,
  parseSortParams,
} = require('../utils/paginationUtils');

// Import Schema
const Admin = require('../schemas/adminUserSchema');
const User = require('../schemas/userSchema');

// Initialize Controllers

// @desc    Report whether any admin account exists yet
// @route   GET /api/admin/setup-status
// @access  Public

const getSetupStatus = asyncHandler(async (req, res) => {
  const adminCount = await Admin.countDocuments();
  const needsSetup = adminCount === 0;
  const requiresSetupKey = Boolean(process.env.INITIAL_ADMIN_SETUP_KEY);
  const setupEnabled = needsSetup && (process.env.NODE_ENV !== 'production' || requiresSetupKey);

  res.status(200).json({ needsSetup, setupEnabled, requiresSetupKey });
});

// @desc    Create the very first admin account (one-time bootstrap only)
// @route   POST /api/admin/setup
// @access  Public, but only succeeds while no admin account exists yet.
//          Every admin/manager created after this one must go through the
//          invite flow (see inviteControllers.js).

const bootstrapFirstAdmin = asyncHandler(async (req, res) => {
  const configuredSetupKey = process.env.INITIAL_ADMIN_SETUP_KEY;
  if (process.env.NODE_ENV === 'production' && !configuredSetupKey) {
    throw ApiError.serviceUnavailable(
      'First-admin setup is disabled. Configure INITIAL_ADMIN_SETUP_KEY for this deployment.'
    );
  }

  if (configuredSetupKey) {
    const submittedDigest = crypto
      .createHash('sha256')
      .update(typeof req.body.setupKey === 'string' ? req.body.setupKey : '')
      .digest();
    const configuredDigest = crypto.createHash('sha256').update(configuredSetupKey).digest();
    if (!crypto.timingSafeEqual(submittedDigest, configuredDigest)) {
      throw ApiError.forbidden('The setup key is invalid, or initial setup is no longer available.');
    }
  }

  // Ensure the concurrency guard exists even when production disables Mongoose
  // auto-indexing. Existing admin documents without this field are unaffected.
  await Admin.collection.createIndex(
    { bootstrapKey: 1 },
    {
      name: 'unique_initial_admin_bootstrap',
      unique: true,
      partialFilterExpression: { bootstrapKey: 'first-admin' },
    }
  );

  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    throw ApiError.forbidden(
      'Initial setup has already been completed. New admin accounts are invite-only.'
    );
  }

  const { name, email, password } = req.body;

  // An email can only belong to one account across User + Admin in unified
  // auth — otherwise login/password-reset resolution becomes ambiguous.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.emailExists('A customer account with this email already exists.');
  }

  const hashedPassword = await hashPassword(password);

  let admin;
  try {
    admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
      permissions: [USER_ROLES.ADMIN],
      isApproved: true,
      bootstrapKey: 'first-admin',
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.bootstrapKey) {
      throw ApiError.forbidden(
        'Initial setup was just completed. Refresh this page and sign in with the new admin account.'
      );
    }
    if (error.code === 11000 && error.keyPattern?.email) {
      throw ApiError.emailExists('An account with this email already exists. Try logging in instead.');
    }
    throw error;
  }

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    isApproved: admin.isApproved,
    token: generateToken(admin._id),
    message: 'Admin account created successfully!',
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
    throw ApiError.notFound('Admin');
  }
});

// @desc    Update Admin Profile
// @route   PUT /api/admin/profile
// @access  Private

const updateAdminProfile = asyncHandler(async (req, res) => {
  const adminUser = await Admin.findById(req.user._id);

  if (!adminUser) {
    throw ApiError.notFound('Admin');
  }

  const { name, email, password } = req.body;

  if (password && password !== '') {
    adminUser.password = await hashPassword(password);
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
  const { page, limit } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, '-createdAt', ['createdAt', 'name', 'email', 'role']);
  const result = await aggregatePaginated(Admin, [{ $match: {} }], {
    page,
    limit,
    sort,
    dataStages: [
      {
        $project: {
          password: 0,
          verificationCode: 0,
          resetPasswordToken: 0,
          resetPasswordExpire: 0,
          bootstrapKey: 0,
          __v: 0,
        },
      },
    ],
  });
  res.status(200).json(result);
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
    throw ApiError.notFound('Admin');
  }
});

// @desc    Update Admin By Id
// @route   PUT /api/admin/:id
// @access  Private/Admin

const updateAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    throw ApiError.notFound('Admin');
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
    throw ApiError.notFound('Admin');
  }
});

// Export Controllers
module.exports = {
  getSetupStatus,
  bootstrapFirstAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
