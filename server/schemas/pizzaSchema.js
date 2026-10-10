const mongoose = require('mongoose');
const { USER_ROLES } = require('../constants');

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Base',
      },
    ],
    sauces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sauce',
      },
    ],
    cheeses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cheese',
      },
    ],
    veggies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veggie',
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
pizzaSchema.index({ createdBy: 1 });
pizzaSchema.index({ price: 1 });
pizzaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Pizza', pizzaSchema);
