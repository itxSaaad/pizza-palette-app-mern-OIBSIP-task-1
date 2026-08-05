const asyncHandler = require('express-async-handler');
const { runInventoryCheck } = require('../utils/inventoryAlertUtils');
const { getLowStockAlert } = require('../utils/analyticsUtils');
const ApiError = require('../utils/ApiError');

// @desc    Check low inventory and send alerts
// @route   POST /api/inventory/check-alerts
// @access  Private/Admin

const checkAndSendAlerts = asyncHandler(async (req, res) => {
  const result = await runInventoryCheck();

  if (!result.success) {
    console.error('Inventory alert check failed:', result.error);
    throw ApiError.serverError('Unable to check inventory alerts right now. Please try again.');
  }

  res.status(200).json(result);
});

// @desc    Get current low inventory items
// @route   GET /api/inventory/low-stock
// @access  Private/Admin

const getLowInventoryItems = asyncHandler(async (req, res) => {
  const lowStockData = await getLowStockAlert();
  res.status(200).json(lowStockData);
});

module.exports = {
  checkAndSendAlerts,
  getLowInventoryItems,
};
