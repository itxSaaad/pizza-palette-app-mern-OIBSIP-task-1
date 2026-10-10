const asyncHandler = require('express-async-handler');
const { runInventoryCheck } = require('../utils/inventoryAlertUtils');
const ApiError = require('../utils/ApiError');
const { Base, Sauce, Cheese, Veggie } = require('../schemas/inventorySchema');
const {
  aggregatePaginated,
  parsePaginationParams,
  parseSortParams,
} = require('../utils/paginationUtils');

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

// @desc    Run the same check on a schedule, triggered by Vercel Cron
//          (see server/vercel.json) rather than an admin — node-cron can't
//          run inside a serverless function, so production automation goes
//          through this route instead.
// @route   GET /api/inventory/cron/check-alerts
// @access  Cron secret (see cronAuthMiddleware)

const runScheduledCheck = asyncHandler(async (req, res) => {
  const result = await runInventoryCheck();

  if (!result.success) {
    console.error('Scheduled inventory check failed:', result.error);
    throw ApiError.serverError('Scheduled inventory check failed.');
  }

  res.status(200).json(result);
});

// @desc    Get current low inventory items
// @route   GET /api/inventory/low-stock
// @access  Private/Admin

const getLowInventoryItems = asyncHandler(async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const sort = parseSortParams(req.query, 'quantity', [
    'createdAt',
    'item',
    'quantity',
    'threshold',
  ]);
  const unionStage = (Model, type) => ({
    $unionWith: { coll: Model.collection.name, pipeline: [{ $set: { type } }] },
  });
  const result = await aggregatePaginated(
    Base,
    [
      { $set: { type: 'Base' } },
      unionStage(Sauce, 'Sauce'),
      unionStage(Cheese, 'Cheese'),
      unionStage(Veggie, 'Veggie'),
      { $match: { $expr: { $lte: ['$quantity', '$threshold'] } } },
      { $set: { deficit: { $subtract: ['$threshold', '$quantity'] } } },
    ],
    { page, limit, sort, dataStages: [{ $project: { __v: 0 } }] }
  );
  res.status(200).json(result);
});

module.exports = {
  checkAndSendAlerts,
  getLowInventoryItems,
  runScheduledCheck,
};
