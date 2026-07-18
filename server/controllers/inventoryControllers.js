const asyncHandler = require('express-async-handler');

// Import Constants
const { INVENTORY_TYPES } = require('../constants');

// Import Schemas
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');
const ApiError = require('../utils/ApiError');

// Initialize Controllers

// @desc    Get all Stocks
// @route   GET /api/stocks
// @access  Private

const getAllStocks = asyncHandler(async (req, res) => {
  const base = await Base.find({});
  const sauce = await Sauce.find({});
  const cheese = await Cheese.find({});
  const veggie = await Veggie.find({});

  if (base && sauce && cheese && veggie) {
    res.status(200).json({
      bases: base,
      sauces: sauce,
      cheeses: cheese,
      veggies: veggie,
    });
  } else {
    throw ApiError.notFound('Stock', 'No stock found.');
  }
});

// @desc    Get Stock by Id
// @route   GET /api/stocks/:id
// @access  Private/Public

const getStockById = asyncHandler(async (req, res) => {
  const base = await Base.findById(req.params.id);
  const sauce = await Sauce.findById(req.params.id);
  const cheese = await Cheese.findById(req.params.id);
  const veggie = await Veggie.findById(req.params.id);

  if (base || sauce || cheese || veggie) {
    res.status(200).json({ base, sauce, cheese, veggie });
  } else {
    throw ApiError.notFound('Stock item');
  }
});

// @desc    Create Stock
// @route   POST /api/stocks
// @access  Admin

const createStock = asyncHandler(async (req, res) => {
  const { type, item, price, quantity, threshold } = req.body;

  let createdStock;

  switch (type) {
    case INVENTORY_TYPES[0]: // 'Base'
      createdStock = await Base.create({ item, price, quantity, threshold });
      break;
    case INVENTORY_TYPES[1]: // 'Sauce'
      createdStock = await Sauce.create({ item, price, quantity, threshold });
      break;
    case INVENTORY_TYPES[2]: // 'Cheese'
      createdStock = await Cheese.create({ item, price, quantity, threshold });
      break;
    case INVENTORY_TYPES[3]: // 'Veggie'
      createdStock = await Veggie.create({ item, price, quantity, threshold });
      break;
    default:
      throw ApiError.validation('That stock type is not recognized.');
  }

  res.status(201).json(createdStock);
});

// @desc Update Stock by Id
// @route PUT /api/stocks/:id
// @access Admin

const updateStockById = asyncHandler(async (req, res) => {
  const base = await Base.findById(req.params.id);
  const sauce = await Sauce.findById(req.params.id);
  const cheese = await Cheese.findById(req.params.id);
  const veggie = await Veggie.findById(req.params.id);

  if (base || sauce || cheese || veggie) {
    if (base) {
      base.quantity = req.body.quantity;
      const updatedBase = await base.save();
      if (updatedBase) {
        res.status(200).json({ message: 'Base Updated!' });
      }
    } else if (sauce) {
      sauce.quantity = req.body.quantity;
      const updatedSauce = await sauce.save();
      if (updatedSauce) {
        res.status(200).json({ message: 'Sauce Updated!' });
      }
    } else if (cheese) {
      cheese.quantity = req.body.quantity;
      const updatedCheese = await cheese.save();
      if (updatedCheese) {
        res.status(200).json({ message: 'Cheese Updated!' });
      }
    } else if (veggie) {
      veggie.quantity = req.body.quantity;
      const updatedVeggie = await veggie.save();
      if (updatedVeggie) {
        res.status(200).json({ message: 'Veggie Updated!' });
      }
    }
  } else {
    throw ApiError.notFound('Stock item');
  }
});

// @desc    Delete Stock by Id
// @route   DELETE /api/stocks/:id
// @access  Admin

const deleteStockById = asyncHandler(async (req, res) => {
  const base = await Base.findById(req.params.id);
  const sauce = await Sauce.findById(req.params.id);
  const cheese = await Cheese.findById(req.params.id);
  const veggie = await Veggie.findById(req.params.id);

  if (base || sauce || cheese || veggie) {
    if (base) {
      await base.deleteOne();
      res.status(200).json({ message: 'Base Deleted!' });
    } else if (sauce) {
      await sauce.deleteOne();
      res.status(200).json({ message: 'Sauce Deleted!' });
    } else if (cheese) {
      await cheese.deleteOne();
      res.status(200).json({ message: 'Cheese Deleted!' });
    } else if (veggie) {
      await veggie.deleteOne();
      res.status(200).json({ message: 'Veggie Deleted!' });
    }
  } else {
    throw ApiError.notFound('Stock item');
  }
});

// Export Controllers
module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStockById,
  deleteStockById,
};
