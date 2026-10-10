const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { connectDb, getConnectionStatus } = require('../config/db');

const getHealth = (_req, res) => {
  res.status(200).json(
    ApiResponse.success(
      {
        service: 'pizza-palette-api',
        status: 'ok',
        uptimeSeconds: process.uptime(),
        database: getConnectionStatus(),
      },
      'Service is live'
    )
  );
};

const getReadiness = asyncHandler(async (_req, res) => {
  try {
    await connectDb();
  } catch (error) {
    console.warn('Readiness check failed:', error.message);
    throw ApiError.serviceUnavailable('Database connection is not ready');
  }

  res.status(200).json(
    ApiResponse.success(
      { service: 'pizza-palette-api', status: 'ready', database: getConnectionStatus() },
      'Application is ready to accept requests'
    )
  );
});

module.exports = { getHealth, getReadiness };
