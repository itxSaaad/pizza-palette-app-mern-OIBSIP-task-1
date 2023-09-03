const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryAddress: {
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    salesTax: {
      type: Number,
      default: 0,
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    payment: {
      method: {
        type: String,
        enum: ['stripe', 'razorpay'],
        required: true,
      },
      stripePaymentIntentId: { type: String }, // For Stripe payments
      razorpayOrderId: { type: String }, // For Razorpay payments
      status: { type: String }, // Payment status
    },
    status: {
      type: String,
      enum: ['Received', 'In the Kitchen', 'Sent for Delivery', 'Delivered'],
      default: 'Received',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
