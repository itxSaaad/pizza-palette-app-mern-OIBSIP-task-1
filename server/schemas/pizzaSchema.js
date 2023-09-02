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
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
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

module.exports = mongoose.model('Pizza', pizzaSchema);
