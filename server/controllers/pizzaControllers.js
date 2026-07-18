const asyncHandler = require('express-async-handler');

// Import Utils
const { parsePaginationParams, parseSortParams, buildPaginationResponse } = require('../utils/paginationUtils');
const { USER_ROLES } = require('../constants');

// Import Schema
const Pizza = require('../schemas/pizzaSchema');

// Initialize Controllers

// @desc    Get all Pizzas
// @route   GET /api/pizzas
// @access  Public

const getAllPizzas = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, '-createdAt');
  
  // Build filter
  const filter = {};
  if (req.query.size) {
    filter.size = req.query.size;
  }
  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }
  if (req.query.minPrice) {
    filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
  }
  if (req.query.maxPrice) {
    filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
  }

  const [pizzas, total] = await Promise.all([
    Pizza.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v'),
    Pizza.countDocuments(filter)
  ]);

  res.status(200).json(buildPaginationResponse(pizzas, total, page, limit));
});

// @desc    Get Pizza by Id
// @route   GET /api/pizzas/:id
// @access  Private/Public

const getPizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);

  if (pizza) {
    res.status(200).json(pizza);
  } else {
    res.status(404);
    throw new Error('Pizza Not Found!');
  }
});

// @desc Create Custom Pizza (regular user, via pizza builder)
// @route POST /api/pizzas
// @access Private

const createPizza = asyncHandler(async (req, res) => {
  const { name, description, bases, sauces, cheeses, veggies, price, imageUrl } = req.body;

  const pizza = new Pizza({
    name,
    description,
    bases,
    sauces,
    cheeses,
    veggies,
    price,
    createdBy: USER_ROLES.USER,
    imageUrl,
  });

  const createdPizza = await pizza.save();

  res.status(201).json({
    _id: createdPizza._id,
    name: createdPizza.name,
    description: createdPizza.description,
    bases: createdPizza.bases,
    sauces: createdPizza.sauces,
    cheeses: createdPizza.cheeses,
    veggies: createdPizza.veggies,
    price: createdPizza.price,
    createdBy: createdPizza.createdBy,
    imageUrl: createdPizza.imageUrl,
    message: 'Pizza Created Successfully!',
  });
});

// @desc Create Menu Pizza (admin only)
// @route POST /api/pizzas/admin
// @access Private/Admin

const createAdminPizza = asyncHandler(async (req, res) => {
  const { name, description, bases, sauces, cheeses, veggies, price, imageUrl } = req.body;

  const pizza = new Pizza({
    name,
    description,
    bases,
    sauces,
    cheeses,
    veggies,
    price,
    createdBy: USER_ROLES.ADMIN,
    imageUrl,
  });

  const createdPizza = await pizza.save();

  res.status(201).json({
    _id: createdPizza._id,
    name: createdPizza.name,
    description: createdPizza.description,
    bases: createdPizza.bases,
    sauces: createdPizza.sauces,
    cheeses: createdPizza.cheeses,
    veggies: createdPizza.veggies,
    price: createdPizza.price,
    createdBy: createdPizza.createdBy,
    imageUrl: createdPizza.imageUrl,
    message: 'Pizza Created Successfully!',
  });
});

// @desc    Update Pizza By Id
// @route   PUT /api/Pizzas/:id
// @access  Private/Admin

const updatePizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);

  if (pizza) {
    pizza.name = req.body.name || pizza.name;
    pizza.description = req.body.description || pizza.description;
    pizza.bases = req.body.bases || pizza.bases;
    pizza.sauces = req.body.sauces || pizza.sauces;
    pizza.cheeses = req.body.cheeses || pizza.cheeses;
    pizza.veggies = req.body.veggies || pizza.veggies;
    pizza.price = req.body.price || pizza.price;
    pizza.imageUrl = req.body.imageUrl || pizza.imageUrl;

    const updatedPizza = await pizza.save();

    if (updatedPizza) {
      res.status(200).json({
        _id: updatedPizza._id,
        name: updatedPizza.name,
        description: updatedPizza.description,
        bases: updatedPizza.bases,
        sauces: updatedPizza.sauces,
        cheeses: updatedPizza.cheeses,
        veggies: updatedPizza.veggies,
        price: updatedPizza.price,
        imageUrl: updatedPizza.imageUrl,
        message: 'Pizza Updated Successfully!',
      });
    } else {
      res.status(500);
      throw new Error('Internal Server Error!');
    }
  } else {
    res.status(404);
    throw new Error('Pizza Not Found!');
  }
});

// @desc    Delete a Pizza By Id
// @route   DELETE /api/Pizzas/:id
// @access  Private/Admin

const deletePizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);

  if (pizza) {
    res.status(200).json({ message: 'Pizza Removed Successfully!' });
  } else {
    res.status(404);
    throw new Error('Pizza Not Found!');
  }
});

// Export Controllers
module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  createAdminPizza,
  updatePizzaById,
  deletePizzaById,
};
