const mongoose = require('mongoose');

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
    base: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    sauces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    cheeses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    veggies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
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

module.exports = mongoose.model('Pizza', pizzaSchema);
