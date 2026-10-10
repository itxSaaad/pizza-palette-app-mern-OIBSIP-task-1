const asyncHandler = require('express-async-handler');

// Import Utils
const { aggregatePaginated, parsePaginationParams } = require('../utils/paginationUtils');
const { USER_ROLES } = require('../constants');
const ApiError = require('../utils/ApiError');

// Import Schema
const Pizza = require('../schemas/pizzaSchema');

const parsePizzaListingQuery = (query) => {
  const { page, limit } = parsePaginationParams(query);
  const issues = [];

  const createdBy = query.createdBy || USER_ROLES.ADMIN;
  if (!['all', USER_ROLES.ADMIN, USER_ROLES.USER].includes(createdBy)) {
    issues.push({ field: 'createdBy', message: 'Must be a supported creator role.' });
  }

  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);
  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    issues.push({ field: 'minPrice', message: 'Must be a non-negative number.' });
  }
  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    issues.push({ field: 'maxPrice', message: 'Must be a non-negative number.' });
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    issues.push({ field: 'maxPrice', message: 'Must be greater than or equal to minPrice.' });
  }

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'desc';
  if (!['createdAt', 'name', 'price'].includes(sortBy)) {
    issues.push({ field: 'sortBy', message: 'Must be createdAt, name, or price.' });
  }
  if (!['asc', 'desc'].includes(sortOrder)) {
    issues.push({ field: 'sortOrder', message: 'Must be asc or desc.' });
  }
  if (issues.length) throw ApiError.validation('Invalid pizza listing parameters.', issues);

  return { page, limit, minPrice, maxPrice, sortBy, sortOrder, createdBy };
};

// Initialize Controllers

// @desc    Get all Pizzas
// @route   GET /api/pizzas
// @access  Public

const getAllPizzas = asyncHandler(async (req, res) => {
  const { page, limit, minPrice, maxPrice, sortBy, sortOrder, createdBy } = parsePizzaListingQuery(
    req.query
  );
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1, _id: 1 };

  // Build filter
  const filter = {};
  if (createdBy !== 'all') filter.createdBy = createdBy;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const result = await aggregatePaginated(Pizza, [{ $match: filter }], {
    page,
    limit,
    sort,
    dataStages: [{ $project: { __v: 0 } }],
  });

  res.status(200).json(result);
});

// @desc    Get Pizza by Id
// @route   GET /api/pizzas/:id
// @access  Private/Public

const getPizzaById = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findById(req.params.id);

  if (pizza) {
    res.status(200).json(pizza);
  } else {
    throw ApiError.notFound('Pizza');
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
      throw ApiError.serverError("We couldn't save your changes. Please try again.");
    }
  } else {
    throw ApiError.notFound('Pizza');
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
    throw ApiError.notFound('Pizza');
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
