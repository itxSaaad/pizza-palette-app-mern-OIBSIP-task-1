const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pizzas: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Received', 'In the Kitchen', 'Sent for Delivery', 'Delivered'],
      default: 'Received',
    },
    shippingAddress: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
    ],
    paymentDetails: {
      id: { type: String },
      status: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
