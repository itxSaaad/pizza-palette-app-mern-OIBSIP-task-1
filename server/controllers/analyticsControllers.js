const asyncHandler = require('express-async-handler');
const {
  getOrderStatistics,
  getPopularPizzas,
  getInventoryUsageTrends,
  getUserAnalytics,
  getDailyRevenueReport,
  getLowStockAlert,
  getNewUsersCount
} = require('../utils/analyticsUtils');

// @desc    Get order statistics
// @route   GET /api/analytics/orders
// @access  Private/Admin
const fetchOrderStatistics = asyncHandler(async (req, res) => {
  const stats = await getOrderStatistics();
  res.status(200).json(stats);
});

// @desc    Get popular pizzas
// @route   GET /api/analytics/popular-pizzas
// @access  Private/Admin
const fetchPopularPizzas = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const pizzas = await getPopularPizzas(limit);
  res.status(200).json(pizzas);
});

// @desc    Get inventory usage trends
// @route   GET /api/analytics/inventory-usage
// @access  Private/Admin
const fetchInventoryUsage = asyncHandler(async (req, res) => {
  const usageTrends = await getInventoryUsageTrends();
  res.status(200).json(usageTrends);
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const fetchUserAnalytics = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const analytics = await getUserAnalytics(limit);
  res.status(200).json(analytics);
});

// @desc    Get daily revenue report
// @route   GET /api/analytics/revenue
// @access  Private/Admin
const fetchDailyRevenue = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const revenue = await getDailyRevenueReport(days);
  res.status(200).json(revenue);
});

// @desc    Get low stock alert
// @route   GET /api/analytics/low-stock
// @access  Private/Admin
const fetchLowStockAlert = asyncHandler(async (req, res) => {
  const lowStock = await getLowStockAlert();
  res.status(200).json(lowStock);
});

// @desc    Get new users count
// @route   GET /api/analytics/new-users
// @access  Private/Admin
const fetchNewUsers = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const newUsers = await getNewUsersCount(days);
  res.status(200).json(newUsers);
});

// @desc    Get dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const fetchDashboardSummary = asyncHandler(async (req, res) => {
  const [orderStats, popularPizzas, lowStock, newUsers] = await Promise.all([
    getOrderStatistics(),
    getPopularPizzas(5),
    getLowStockAlert(),
    getNewUsersCount(30)
  ]);

  res.status(200).json({
    orderStats,
    popularPizzas,
    lowStock,
    newUsers
  });
});

module.exports = {
  fetchOrderStatistics,
  fetchPopularPizzas,
  fetchInventoryUsage,
  fetchUserAnalytics,
  fetchDailyRevenue,
  fetchLowStockAlert,
  fetchNewUsers,
  fetchDashboardSummary
};
