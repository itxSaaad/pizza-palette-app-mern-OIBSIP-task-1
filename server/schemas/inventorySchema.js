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

baseSchema.index({ item: 1 });
baseSchema.index({ quantity: 1 });

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

sauceSchema.index({ item: 1 });
sauceSchema.index({ quantity: 1 });

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

cheeseSchema.index({ item: 1 });
cheeseSchema.index({ quantity: 1 });

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

veggieSchema.index({ item: 1 });
veggieSchema.index({ quantity: 1 });

module.exports = {
  Base: mongoose.model('Base', baseSchema),
  Sauce: mongoose.model('Sauce', sauceSchema),
  Cheese: mongoose.model('Cheese', cheeseSchema),
  Veggie: mongoose.model('Veggie', veggieSchema),
};
