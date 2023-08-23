// Import Schema
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');

// Update inventory quantity for a given item
const updateInventoryQuantity = async (pizza, qty) => {
  const { base, sauces, cheeses, veggies } = pizza;

  // Update base quantity
  for (const baseId of base) {
    const baseItem = await Base.findById(baseId);
    await updateQuantity(baseItem);
  }

  // Update sauce quantity
  for (const sauceId of sauces) {
    const sauceItem = await Sauce.findById(sauceId);
    await updateQuantity(sauceItem);
  }

  // Update cheese quantity
  for (const cheeseId of cheeses) {
    const cheeseItem = await Cheese.findById(cheeseId);
    await updateQuantity(cheeseItem);
  }
  // Update veggie quantity
  for (const veggieId of veggies) {
    const veggieItem = await Veggie.findById(veggieId);
    await updateQuantity(veggieItem);
  }
};

const updateQuantity = async (item) => {
  if (item) {
    if (item.quantity >= qty) {
      item.quantity -= qty;
      const updateditem = await item.save();
      if (updateditem) {
        res.status(200);
        throw new Error(`Inventory Item ${item.item} Updated!`);
      }
    } else {
      res.status(400);
      throw new Error(`Not enough ${item.item} in stock!`);
    }
  } else {
    res.status(404);
    throw new Error('Inventory Item Not Found!');
  }
};

module.exports = { updateInventoryQuantity };
