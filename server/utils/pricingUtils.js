const { getPizzaSizeMultiplier } = require('../constants/pizzaSizes');
const Pizza = require('../schemas/pizzaSchema');
const ApiError = require('./ApiError');

const SALES_TAX_RATE = 0.15;
const FREE_DELIVERY_THRESHOLD = 100;
const DELIVERY_CHARGE = 10;

/**
 * Recompute trusted order pricing server-side from the database, ignoring
 * any price/tax/total values supplied by the client.
 *
 * @param {Array<{pizza: string, qty: number, size: string, name?: string}>} orderItems
 * @returns {Promise<{pricedItems: Array, itemsTotal: number, salesTax: number, deliveryCharges: number, totalPrice: number}>}
 */
const calculateOrderPricing = async (orderItems) => {
  const pizzaIds = orderItems.map((item) => item.pizza);
  const pizzas = await Pizza.find({ _id: { $in: pizzaIds } }).select('price');
  const pizzaPriceById = new Map(pizzas.map((pizza) => [pizza._id.toString(), pizza.price]));

  const pricedItems = orderItems.map((item) => {
    const basePrice = pizzaPriceById.get(item.pizza?.toString());
    if (basePrice === undefined) {
      throw ApiError.notFound('Pizza', `One or more pizzas in your order could not be found.`);
    }

    const multiplier = getPizzaSizeMultiplier(item.size);
    const price = parseFloat((basePrice * multiplier).toFixed(2));

    return { ...item, price };
  });

  const itemsTotal = pricedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const salesTax = parseFloat((SALES_TAX_RATE * itemsTotal).toFixed(2));
  const deliveryCharges = itemsTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const totalPrice = parseFloat((itemsTotal + deliveryCharges + salesTax).toFixed(2));

  return { pricedItems, itemsTotal, salesTax, deliveryCharges, totalPrice };
};

module.exports = {
  calculateOrderPricing,
  SALES_TAX_RATE,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
};
