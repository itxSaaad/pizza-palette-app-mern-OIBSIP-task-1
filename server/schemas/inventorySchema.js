const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    threshold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inventory', inventorySchema);
