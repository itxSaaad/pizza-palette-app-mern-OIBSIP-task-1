const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');
const Pizza = require('../schemas/pizzaSchema');

/**
 * Deduct inventory for a pizza order
 * @param {String} pizzaId - Pizza ID
 * @param {Number} quantity - Quantity ordered
 * @returns {Promise<Object>} - Deduction result
 */
const deductInventoryForPizza = async (pizzaId, quantity) => {
  const pizza = await Pizza.findById(pizzaId)
    .populate('bases')
    .populate('sauces')
    .populate('cheeses')
    .populate('veggies');

  if (!pizza) {
    throw new Error(`Pizza not found: ${pizzaId}`);
  }

  const deductions = [];
  const insufficientStock = [];

  // Check all ingredients
  const checkIngredients = async (ingredients, Model, type) => {
    for (const ingredient of ingredients) {
      if (ingredient.quantity < quantity) {
        insufficientStock.push({
          type,
          item: ingredient.item,
          required: quantity,
          available: ingredient.quantity
        });
      } else {
        deductions.push({
          model: Model,
          id: ingredient._id,
          quantity,
          type,
          item: ingredient.item
        });
      }
    }
  };

  // Check all ingredient types
  await checkIngredients(pizza.bases, Base, 'base');
  await checkIngredients(pizza.sauces, Sauce, 'sauce');
  await checkIngredients(pizza.cheeses, Cheese, 'cheese');
  await checkIngredients(pizza.veggies, Veggie, 'veggie');

  return { deductions, insufficientStock };
};

/**
 * Execute inventory deductions with rollback support
 * @param {Array} orderItems - Array of order items
 * @returns {Promise<Object>} - Result with deductions made
 */
const executeInventoryDeductions = async (orderItems) => {
  const allDeductions = [];
  const insufficientItems = [];

  // First, check all items for sufficient stock
  for (const item of orderItems) {
    const { deductions, insufficientStock } = await deductInventoryForPizza(
      item.pizza,
      item.qty
    );

    if (insufficientStock.length > 0) {
      insufficientItems.push(...insufficientStock);
    } else {
      allDeductions.push(...deductions);
    }
  }

  // If any item has insufficient stock, reject the entire order
  if (insufficientItems.length > 0) {
    return {
      success: false,
      insufficientItems,
      message: 'Insufficient inventory for one or more items'
    };
  }

  // Execute all deductions
  const executedDeductions = [];
  
  try {
    for (const deduction of allDeductions) {
      const updated = await deduction.model.findByIdAndUpdate(
        deduction.id,
        { $inc: { quantity: -deduction.quantity } },
        { new: true }
      );

      executedDeductions.push({
        ...deduction,
        newQuantity: updated.quantity
      });
    }

    return {
      success: true,
      deductions: executedDeductions,
      message: 'Inventory deducted successfully'
    };
  } catch (error) {
    // Rollback all deductions if any fail
    await rollbackInventoryDeductions(executedDeductions);
    console.error('Inventory deduction failed:', error);
    throw new Error('We had trouble updating our kitchen inventory. Please try again.');
  }
};

/**
 * Rollback inventory deductions
 * @param {Array} deductions - Array of executed deductions
 * @returns {Promise<void>}
 */
const rollbackInventoryDeductions = async (deductions) => {
  for (const deduction of deductions) {
    try {
      await deduction.model.findByIdAndUpdate(
        deduction.id,
        { $inc: { quantity: deduction.quantity } }
      );
      console.log(`Rolled back deduction for ${deduction.type}: ${deduction.item}`);
    } catch (error) {
      console.error(`Failed to rollback ${deduction.type} ${deduction.item}:`, error);
    }
  }
};

/**
 * Check if order can be fulfilled with current inventory
 * @param {Array} orderItems - Array of order items
 * @returns {Promise<Object>} - Check result
 */
const checkInventoryAvailability = async (orderItems) => {
  const insufficientItems = [];

  for (const item of orderItems) {
    const { insufficientStock } = await deductInventoryForPizza(item.pizza, item.qty);
    
    if (insufficientStock.length > 0) {
      insufficientItems.push({
        pizzaId: item.pizza,
        pizzaName: item.name,
        insufficientIngredients: insufficientStock
      });
    }
  }

  return {
    available: insufficientItems.length === 0,
    insufficientItems
  };
};

module.exports = {
  deductInventoryForPizza,
  executeInventoryDeductions,
  rollbackInventoryDeductions,
  checkInventoryAvailability
};
