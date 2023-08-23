const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

const sauceSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

const cheeseSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

const veggieSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Base: mongoose.model('Base', baseSchema),
  Sauce: mongoose.model('Sauce', sauceSchema),
  Cheese: mongoose.model('Cheese', cheeseSchema),
  Veggie: mongoose.model('Veggie', veggieSchema),
};
