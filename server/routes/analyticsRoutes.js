const express = require('express');

// Initialize Express Router
const router = express.Router();

// Import Middlewares
const { protect, admin } = require('../middlewares/authMiddlewares');

// Import Controllers
const {
  fetchOrderStatistics,
  fetchPopularPizzas,
  fetchInventoryUsage,
  fetchUserAnalytics,
  fetchDailyRevenue,
  fetchLowStockAlert,
  fetchNewUsers,
  fetchDashboardSummary
} = require('../controllers/analyticsControllers');

// All routes are admin-protected
router.use(protect, admin);

// Analytics Routes
router.get('/dashboard', fetchDashboardSummary);
router.get('/orders', fetchOrderStatistics);
router.get('/popular-pizzas', fetchPopularPizzas);
router.get('/inventory-usage', fetchInventoryUsage);
router.get('/users', fetchUserAnalytics);
router.get('/revenue', fetchDailyRevenue);
router.get('/low-stock', fetchLowStockAlert);
router.get('/new-users', fetchNewUsers);

// Export Router
module.exports = router;
