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

  // Accumulate in integer cents rather than JS floats — summing many
  // decimal prices can drift by fractions of a cent (e.g. 99.9999999997),
  // which could otherwise flip the free-delivery threshold check right at
  // the $100 boundary. Only convert back to dollars once, at the end.
  const itemsTotalCents = pricedItems.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.qty,
    0
  );
  const salesTaxCents = Math.round(SALES_TAX_RATE * itemsTotalCents);
  const deliveryChargesCents =
    itemsTotalCents >= FREE_DELIVERY_THRESHOLD * 100 ? 0 : DELIVERY_CHARGE * 100;
  const totalPriceCents = itemsTotalCents + salesTaxCents + deliveryChargesCents;

  const itemsTotal = itemsTotalCents / 100;
  const salesTax = salesTaxCents / 100;
  const deliveryCharges = deliveryChargesCents / 100;
  const totalPrice = totalPriceCents / 100;

  return { pricedItems, itemsTotal, salesTax, deliveryCharges, totalPrice };
};

module.exports = {
  calculateOrderPricing,
  SALES_TAX_RATE,
  FREE_DELIVERY_THRESHOLD,
  DELIVERY_CHARGE,
};
