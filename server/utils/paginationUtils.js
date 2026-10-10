const ApiError = require('./ApiError');

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

const parsePaginationParams = (query) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? DEFAULT_PAGE_SIZE : Number(query.limit);

  if (!Number.isSafeInteger(page) || page < 1) {
    throw ApiError.validation('Invalid pagination parameters.', [
      { field: 'page', message: 'Must be a positive integer.' },
    ]);
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) {
    throw ApiError.validation('Invalid pagination parameters.', [
      { field: 'limit', message: `Must be an integer between 1 and ${MAX_PAGE_SIZE}.` },
    ]);
  }
  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip)) {
    throw ApiError.validation('Invalid pagination parameters.', [
      { field: 'page', message: 'Page is too large.' },
    ]);
  }

  return { page, limit, skip };
};

/**
 * Add a MongoDB $facet that pages rows and computes totals in the database.
 * `beforeFacet` must contain database-side filters/lookups required by both
 * the rows and total count. `dataStages` are only run against the page slice.
 */
const aggregatePaginated = async (Model, beforeFacet, { page, limit, sort, dataStages = [] }) => {
  const fallbackPagination = {
    total: 0,
    page,
    limit,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const [result] = await Model.aggregate([
    ...beforeFacet,
    // Internal bootstrap concurrency metadata must never leak from aggregates.
    { $unset: 'bootstrapKey' },
    {
      $facet: {
        data: [{ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit }, ...dataStages],
        pagination: [
          { $count: 'total' },
          {
            $project: {
              _id: 0,
              total: 1,
              page: { $literal: page },
              limit: { $literal: limit },
              totalPages: { $ceil: { $divide: ['$total', { $literal: limit }] } },
            },
          },
          {
            $addFields: {
              hasNextPage: { $gt: ['$totalPages', '$page'] },
              hasPrevPage: { $gt: ['$page', 1] },
            },
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        pagination: {
          $ifNull: [{ $arrayElemAt: ['$pagination', 0] }, { $literal: fallbackPagination }],
        },
      },
    },
  ]).exec();

  return result || { data: [], pagination: fallbackPagination };
};

/**
 * Parse sort parameters from request query
 * @param {Object} query - Express request query object
 * @param {String} defaultSort - Default sort field
 * @returns {Object} Sort object for MongoDB
 */
const parseSortParams = (query, defaultSort = '-createdAt', allowedFields) => {
  const sortBy = query.sortBy || defaultSort;
  if (
    typeof sortBy !== 'string' ||
    (query.sortOrder !== undefined && !['asc', 'desc'].includes(query.sortOrder))
  ) {
    throw ApiError.validation('Invalid sort parameters.', [
      { field: 'sortBy', message: 'Sort field and direction must be valid strings.' },
    ]);
  }
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;

  if (allowedFields && !allowedFields.includes(field)) {
    throw ApiError.validation('Invalid sort parameters.', [
      { field: 'sortBy', message: `Must be one of: ${allowedFields.join(', ')}.` },
    ]);
  }

  // Handle multiple sort fields
  if (sortBy.startsWith('-')) {
    return { [field]: -1, _id: 1 };
  }

  return { [field]: sortOrder, _id: 1 };
};

/**
 * Build pagination response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Paginated response
 */
const buildPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  aggregatePaginated,
  parsePaginationParams,
  parseSortParams,
  buildPaginationResponse,
};
