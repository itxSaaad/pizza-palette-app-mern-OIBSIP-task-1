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
    base: { type: String, required: true },
    sauces: [{ type: String }],
    cheeses: [{ type: String }],
    veggies: [{ type: String }],
    price: { type: Number, required: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pizza', pizzaSchema);
