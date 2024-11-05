const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    // Basic Information
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

    // Optional Information
    phoneNumber: { type: String }, // User's phone number (optional)
    address: { type: String }, // User's address (optional)

    // Orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Referencing the 'Order' model
      },
    ],

    // Email Verification
    isVerified: {
      type: Boolean,
      default: false, // Email verification status (default is false)
    },

    verificationCode: {
      type: String,
      unique: true,
      default: null,
    },

    // Password Reset
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    // Timestamps
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Export the user schema model
module.exports = mongoose.model('User', userSchema);
