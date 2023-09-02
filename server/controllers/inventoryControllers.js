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
    res.status(200).json({
      bases: base,
      sauces: sauce,
      cheeses: cheese,
      veggies: veggie,
    });
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

// @desc    Create Stock
// @route   POST /api/stocks
// @access  Admin

const createStock = asyncHandler(async (req, res) => {
  if (req.body.type === 'Base') {
    const { item, price, quantity, threshold } = req.body;

    if (!item || !price || !quantity || !threshold) {
      res.status(400);
      throw new Error('Please Fill All Fields!');
    } else {
      if (quantity < threshold) {
        res.status(400);
        throw new Error('Quantity Cannot be less than Threshold!');
      } else {
        const base = new Base({
          item: req.body.item,
          price: req.body.price,
          quantity: req.body.quantity,
          threshold: req.body.threshold,
        });

        const createdBase = await base.save();
        res.status(201).json(createdBase);
      }
    }
  } else if (req.body.type === 'Sauce') {
    const { item, price, quantity, threshold } = req.body;

    if (!item || !price || !quantity || !threshold) {
      res.status(400);
      throw new Error('Please Fill All Fields!');
    } else {
      if (quantity < threshold) {
        res.status(400);
        throw new Error('Quantity Cannot be less than Threshold!');
      } else {
        const sauce = new Sauce({
          item: req.body.item,
          price: req.body.price,
          quantity: req.body.quantity,
          threshold: req.body.threshold,
        });

        const createdSauce = await sauce.save();
        res.status(201).json(createdSauce);
      }
    }
  } else if (req.body.type === 'Cheese') {
    const { item, price, quantity, threshold } = req.body;

    if (!item || !price || !quantity || !threshold) {
      res.status(400);
      throw new Error('Please Fill All Fields!');
    } else {
      if (quantity < threshold) {
        res.status(400);
        throw new Error('Quantity Cannot be less than Threshold!');
      } else {
        const cheese = new Cheese({
          item: req.body.item,
          price: req.body.price,
          quantity: req.body.quantity,
          threshold: req.body.threshold,
        });

        const createdCheese = await cheese.save();
        res.status(201).json(createdCheese);
      }
    }
  } else if (req.body.type === 'Veggie') {
    const { item, price, quantity, threshold } = req.body;

    if (!item || !price || !quantity || !threshold) {
      res.status(400);
      throw new Error('Please Fill All Fields!');
    } else {
      if (quantity < threshold) {
        res.status(400);
        throw new Error('Quantity Cannot be less than Threshold!');
      } else {
        const veggie = new Veggie({
          item: req.body.item,
          price: req.body.price,
          quantity: req.body.quantity,
          threshold: req.body.threshold,
        });

        const createdVeggie = await veggie.save();
        res.status(201).json(createdVeggie);
      }
    }
  } else {
    res.status(404);
    throw new Error('Stock Type Not Found!');
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
      await base.remove();
      res.status(200).json({ message: 'Base Deleted!' });
    } else if (sauce) {
      await sauce.remove();
      res.status(200).json({ message: 'Sauce Deleted!' });
    } else if (cheese) {
      await cheese.remove();
      res.status(200).json({ message: 'Cheese Deleted!' });
    } else if (veggie) {
      await veggie.remove();
      res.status(200).json({ message: 'Veggie Deleted!' });
    }
  } else {
    res.status(404);
    throw new Error('Stock Item Not Found!');
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
