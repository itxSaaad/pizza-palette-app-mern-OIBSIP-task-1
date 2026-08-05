const mongoose = require('mongoose');
const { ADMIN_ROLES } = require('../constants');

// Admin/manager accounts are invite-only. An Invite is a pending record —
// no Admin document exists until the invite is accepted, so an expired or
// revoked invite never leaves a half-created account behind.
const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      required: true,
    },
    // Only the SHA-256 hash of the invite token is stored; the raw token is
    // emailed to the invitee and never persisted, mirroring how the app
    // never stores raw passwords.
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

inviteSchema.index({ email: 1 });
inviteSchema.index({ tokenHash: 1 });
// TTL index: MongoDB automatically deletes the document once expiresAt is in
// the past, so expired invites don't need a manual cleanup job.
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invite', inviteSchema);
