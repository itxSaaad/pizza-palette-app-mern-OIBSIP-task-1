const cron = require('node-cron');
const { runInventoryCheck } = require('./inventoryAlertUtils');

// README advertises low-stock alerts as "automatic," but until now
// checkAndSendAlerts only ran when an admin manually hit
// POST /api/inventory/check-alerts. This schedules the same check to run
// on its own, so the feature actually matches the docs.
//
// Configurable via LOW_STOCK_CHECK_CRON (standard 5-field cron syntax);
// defaults to once daily at 08:00 server time.
const DEFAULT_SCHEDULE = '0 8 * * *';

const startInventoryScheduler = () => {
  const schedule = process.env.LOW_STOCK_CHECK_CRON || DEFAULT_SCHEDULE;

  if (!cron.validate(schedule)) {
    console.error(
      `Invalid LOW_STOCK_CHECK_CRON schedule "${schedule}" — automatic low-stock checks are disabled.`
    );
    return;
  }

  cron.schedule(schedule, async () => {
    console.log('Running scheduled low-stock inventory check...');
    const result = await runInventoryCheck();

    if (!result.success) {
      console.error('Scheduled inventory check failed:', result.error);
    }
  });

  console.log(`Automatic low-stock checks scheduled ("${schedule}").`);
};

module.exports = { startInventoryScheduler };
