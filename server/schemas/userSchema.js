const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema(
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
    phoneNumber: { type: String }, // Optional: User's phone number
    address: { type: String }, // Optional: User's address
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Referencing the 'Order' model
      },
    ],
    isVerified: { type: Boolean, default: false }, // Email verification status
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiration time for reset token
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
