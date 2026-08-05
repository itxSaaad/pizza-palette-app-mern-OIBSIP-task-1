const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

// Import Utils
const generateToken = require('../utils/generateToken');
const { createInviteToken, hashInviteToken } = require('../utils/inviteTokenUtils');
const { USER_ROLES } = require('../constants');
const ApiError = require('../utils/ApiError');

// Import Middlewares
const sendEmail = require('../middlewares/nodemailerMiddleware');

// Import Schemas
const Admin = require('../schemas/adminUserSchema');
const Invite = require('../schemas/inviteSchema');

// Admin/manager accounts are invite-only. Only full admins (not managers)
// can send invites, so a manager can never grant themselves/others admin
// access by inviting a new "admin" account.

// @desc    Send an admin/manager invite
// @route   POST /api/admin/invites
// @access  Private/Admin (role: admin only)

const createInvite = asyncHandler(async (req, res) => {
  if (req.user.role !== USER_ROLES.ADMIN) {
    throw ApiError.forbidden('Only admins can send invites.');
  }

  const { email, role } = req.body;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw ApiError.emailExists('An admin account with this email already exists.');
  }

  // Replace any existing pending invite for this email rather than stacking duplicates.
  await Invite.deleteMany({ email });

  const { rawToken, tokenHash, expiresAt } = createInviteToken();

  const invite = await Invite.create({
    email,
    role,
    tokenHash,
    expiresAt,
    invitedBy: req.user._id,
  });

  const acceptUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${rawToken}`;

  const emailSent = await sendEmail({
    to: email,
    subject: "You've Been Invited to Pizza Palette",
    templateOptions: {
      title: 'Admin Invitation',
      greeting: 'Hello,',
      message: `You've been invited by ${req.user.name} to join Pizza Palette as ${
        role === USER_ROLES.ADMIN ? 'an admin' : 'a manager'
      }.<br><br>This invite link expires in 7 days.`,
      actionUrl: acceptUrl,
      actionText: 'Accept Invite',
    },
  });

  if (!emailSent) {
    await Invite.findByIdAndDelete(invite._id);
    throw ApiError.emailSendFailed('We could not send the invite email. Please try again.');
  }

  res.status(201).json({
    _id: invite._id,
    email: invite.email,
    role: invite.role,
    expiresAt: invite.expiresAt,
    message: 'Invite sent successfully!',
  });
});

// @desc    List pending invites
// @route   GET /api/admin/invites
// @access  Private/Admin

const listInvites = asyncHandler(async (req, res) => {
  const invites = await Invite.find({})
    .select('-tokenHash')
    .populate('invitedBy', 'name email')
    .sort('-createdAt');

  res.status(200).json(invites);
});

// @desc    Revoke a pending invite
// @route   DELETE /api/admin/invites/:id
// @access  Private/Admin

const revokeInvite = asyncHandler(async (req, res) => {
  const invite = await Invite.findByIdAndDelete(req.params.id);

  if (!invite) {
    throw ApiError.notFound('Invite');
  }

  res.status(200).json({ message: 'Invite revoked successfully!' });
});

// @desc    Accept an invite and create the admin/manager account
// @route   POST /api/admin/invites/accept
// @access  Public

const acceptInvite = asyncHandler(async (req, res) => {
  const { token, name, password } = req.body;

  const tokenHash = hashInviteToken(token);
  const invite = await Invite.findOne({ tokenHash, expiresAt: { $gt: new Date() } });

  if (!invite) {
    throw ApiError.validation('This invite link is invalid or has expired.');
  }

  const existingAdmin = await Admin.findOne({ email: invite.email });
  if (existingAdmin) {
    await Invite.findByIdAndDelete(invite._id);
    throw ApiError.emailExists('An admin account with this email already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await Admin.create({
    name,
    email: invite.email,
    password: hashedPassword,
    role: invite.role,
    permissions: [invite.role],
    isApproved: true,
  });

  await Invite.findByIdAndDelete(invite._id);

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    permissions: admin.permissions,
    isApproved: admin.isApproved,
    token: generateToken(admin._id),
    message: 'Account created successfully! You are now logged in.',
  });
});

module.exports = { createInvite, listInvites, revokeInvite, acceptInvite };
