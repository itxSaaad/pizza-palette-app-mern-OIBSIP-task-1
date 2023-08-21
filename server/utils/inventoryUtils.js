// Import Schema
const Inventory = require('../schemas/inventorySchema');

// Update inventory quantity for a given item
const updateInventoryQuantity = async (itemId, qty) => {
  const inventoryItem = await Inventory.findById(itemId);

  if (inventoryItem) {
    if (inventoryItem.quantity >= qty) {
      inventoryItem.quantity -= qty;

      const updatedInventoryItem = await inventoryItem.save();

      if (updatedInventoryItem) {
        res.status(200);
        throw new Error(`Inventory Item ${inventoryItem.item} Updated!`);
      }
    } else {
      res.status(400);
      throw new Error(`Not enough ${inventoryItem.item} in stock!`);
    }
  } else {
    res.status(404);
    throw new Error('Inventory Item Not Found!');
  }
};

module.exports = {
  updateInventoryQuantity,
};
