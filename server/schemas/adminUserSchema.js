const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    permissions: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminUserSchema);
