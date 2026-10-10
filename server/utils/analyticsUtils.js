const Order = require('../schemas/orderSchema');
const User = require('../schemas/userSchema');
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');

// Get order statistics aggregated by status
const getOrderStatistics = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $group: {
        _id: null,
        statsByStatus: {
          $push: {
            status: '$_id',
            count: '$count',
            revenue: '$totalRevenue',
          },
        },
        totalOrders: { $sum: '$count' },
        totalRevenue: { $sum: '$totalRevenue' },
      },
    },
    {
      $project: {
        _id: 0,
        statsByStatus: 1,
        totalOrders: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
      },
    },
  ]);

  return stats.length > 0 ? stats[0] : { statsByStatus: [], totalOrders: 0, totalRevenue: 0 };
};

// Get popular pizzas with order count and revenue
const getPopularPizzas = async (limit = 10) => {
  const popularPizzas = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.pizza',
        totalOrdered: { $sum: '$orderItems.qty' },
        revenue: {
          $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] },
        },
      },
    },
    {
      $lookup: {
        from: 'pizzas',
        localField: '_id',
        foreignField: '_id',
        as: 'pizzaDetails',
      },
    },
    { $unwind: '$pizzaDetails' },
    { $sort: { totalOrdered: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        name: '$pizzaDetails.name',
        totalOrdered: 1,
        revenue: { $round: ['$revenue', 2] },
      },
    },
  ]);

  return popularPizzas;
};

// Get inventory usage trends (last 30 days)
const getInventoryUsageTrends = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const usageTrends = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $unwind: '$orderItems' },
    {
      $lookup: {
        from: 'pizzas',
        localField: 'orderItems.pizza',
        foreignField: '_id',
        as: 'pizza',
      },
    },
    { $unwind: '$pizza' },
    {
      $project: {
        bases: '$pizza.bases',
        sauces: '$pizza.sauces',
        cheeses: '$pizza.cheeses',
        veggies: '$pizza.veggies',
        quantity: '$orderItems.qty',
      },
    },
    {
      $facet: {
        bases: [
          { $unwind: '$bases' },
          {
            $group: {
              _id: '$bases',
              usageCount: { $sum: '$quantity' },
            },
          },
          {
            $lookup: {
              from: 'bases',
              localField: '_id',
              foreignField: '_id',
              as: 'details',
            },
          },
          { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              item: '$details.item',
              usageCount: 1,
            },
          },
          { $sort: { usageCount: -1 } },
        ],
        sauces: [
          { $unwind: '$sauces' },
          {
            $group: {
              _id: '$sauces',
              usageCount: { $sum: '$quantity' },
            },
          },
          {
            $lookup: {
              from: 'sauces',
              localField: '_id',
              foreignField: '_id',
              as: 'details',
            },
          },
          { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              item: '$details.item',
              usageCount: 1,
            },
          },
          { $sort: { usageCount: -1 } },
        ],
        cheeses: [
          { $unwind: '$cheeses' },
          {
            $group: {
              _id: '$cheeses',
              usageCount: { $sum: '$quantity' },
            },
          },
          {
            $lookup: {
              from: 'cheeses',
              localField: '_id',
              foreignField: '_id',
              as: 'details',
            },
          },
          { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              item: '$details.item',
              usageCount: 1,
            },
          },
          { $sort: { usageCount: -1 } },
        ],
        veggies: [
          { $unwind: '$veggies' },
          {
            $group: {
              _id: '$veggies',
              usageCount: { $sum: '$quantity' },
            },
          },
          {
            $lookup: {
              from: 'veggies',
              localField: '_id',
              foreignField: '_id',
              as: 'details',
            },
          },
          { $unwind: { path: '$details', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              _id: 1,
              item: '$details.item',
              usageCount: 1,
            },
          },
          { $sort: { usageCount: -1 } },
        ],
      },
    },
  ]);

  return usageTrends.length > 0
    ? usageTrends[0]
    : { bases: [], sauces: [], cheeses: [], veggies: [] };
};

// Get user analytics
const getUserAnalytics = async (limit = 20) => {
  const userAnalytics = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalPrice' },
        avgOrderValue: { $avg: '$totalPrice' },
        lastOrderDate: { $max: '$createdAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        name: '$userDetails.name',
        email: '$userDetails.email',
        totalOrders: 1,
        totalSpent: { $round: ['$totalSpent', 2] },
        avgOrderValue: { $round: ['$avgOrderValue', 2] },
        lastOrderDate: 1,
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: limit },
  ]);

  return userAnalytics;
};

// Get daily revenue report (last 30 days)
const getDailyRevenueReport = async (days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        dailyRevenue: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        revenue: { $round: ['$dailyRevenue', 2] },
        orderCount: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return dailyRevenue;
};

// Get low stock items with usage rate
const getLowStockAlert = async () => {
  // Shared across Base/Sauce/Cheese/Veggie: project isLow + deficit, keep
  // only the low items, sort by most-depleted first. `deficit` is computed
  // here (rather than in JS afterwards) so this is the single source of
  // truth for low-stock data — inventoryAlertUtils.js's alert-email flow
  // consumes this same result instead of re-querying independently.
  const lowStockPipeline = [
    {
      $project: {
        item: 1,
        quantity: 1,
        threshold: 1,
        isLow: { $lte: ['$quantity', '$threshold'] },
        deficit: { $subtract: ['$threshold', '$quantity'] },
      },
    },
    { $match: { isLow: true } },
    { $sort: { quantity: 1 } },
    { $unset: 'isLow' },
  ];

  const [bases, sauces, cheeses, veggies] = await Promise.all([
    Base.aggregate(lowStockPipeline),
    Sauce.aggregate(lowStockPipeline),
    Cheese.aggregate(lowStockPipeline),
    Veggie.aggregate(lowStockPipeline),
  ]);

  return {
    bases,
    sauces,
    cheeses,
    veggies,
    totalLowStockItems: bases.length + sauces.length + cheeses.length + veggies.length,
  };
};

// Get new users count (last 30 days)
const getNewUsersCount = async (days = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const newUsers = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        count: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  const totalNewUsers = await User.countDocuments({
    createdAt: { $gte: startDate },
  });

  return { dailyNewUsers: newUsers, totalNewUsers };
};

module.exports = {
  getOrderStatistics,
  getPopularPizzas,
  getInventoryUsageTrends,
  getUserAnalytics,
  getDailyRevenueReport,
  getLowStockAlert,
  getNewUsersCount,
};
