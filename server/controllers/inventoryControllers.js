const asyncHandler = require('express-async-handler');

// Import Schemas
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');

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
    res.status(200).json({ base, sauce, cheese, veggie });
  } else {
    res.status(404);
    throw new Error('No Stock Found!');
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
    res.status(404);
    throw new Error('Stock Item Not Found!');
  }
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
    res.status(404);
    throw new Error('Stock Item Not Found!');
  }
});

// Export Controllers
module.exports = { getAllStocks, getStockById, updateStockById };
