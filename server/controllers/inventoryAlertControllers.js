const asyncHandler = require('express-async-handler');
const { checkLowInventory, sendLowInventoryAlerts, runInventoryCheck } = require('../utils/inventoryAlertUtils');

// @desc    Check low inventory and send alerts
// @route   POST /api/inventory/check-alerts
// @access  Private/Admin

const checkAndSendAlerts = asyncHandler(async (req, res) => {
  const result = await runInventoryCheck();
  
  if (!result.success) {
    res.status(500);
    throw new Error(result.error);
  }

  res.status(200).json(result);
});

// @desc    Get current low inventory items
// @route   GET /api/inventory/low-stock
// @access  Private/Admin

const getLowInventoryItems = asyncHandler(async (req, res) => {
  const lowStockData = await checkLowInventory();
  res.status(200).json(lowStockData);
});

module.exports = {
  checkAndSendAlerts,
  getLowInventoryItems
};
