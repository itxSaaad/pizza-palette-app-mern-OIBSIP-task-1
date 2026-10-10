const mongoose = require('mongoose');
const { ADMIN_ROLES } = require('../constants');

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      required: true,
    },
    permissions: [{ type: String }],
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Reserved for the single public bootstrap. A partial unique index closes
    // the count-then-create race when two first-admin requests arrive together.
    bootstrapKey: {
      type: String,
      select: false,
    },

    // Password Reset (mirrors userSchema, so login/forgot-password can be unified)
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ isApproved: 1 });
adminUserSchema.index({ role: 1 });
adminUserSchema.index(
  { bootstrapKey: 1 },
  {
    name: 'unique_initial_admin_bootstrap',
    unique: true,
    partialFilterExpression: { bootstrapKey: 'first-admin' },
  }
);

module.exports = mongoose.model('Admin', adminUserSchema);
