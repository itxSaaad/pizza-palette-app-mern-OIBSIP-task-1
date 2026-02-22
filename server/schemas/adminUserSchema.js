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
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ isApproved: 1 });
adminUserSchema.index({ role: 1 });

module.exports = mongoose.model('Admin', adminUserSchema);
