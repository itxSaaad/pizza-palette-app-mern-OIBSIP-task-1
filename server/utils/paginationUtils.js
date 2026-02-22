/**
 * Parse pagination parameters from request query
 * @param {Object} query - Express request query object
 * @returns {Object} Pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

/**
 * Parse sort parameters from request query
 * @param {Object} query - Express request query object
 * @param {String} defaultSort - Default sort field
 * @returns {Object} Sort object for MongoDB
 */
const parseSortParams = (query, defaultSort = '-createdAt') => {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  
  // Handle multiple sort fields
  if (sortBy.startsWith('-')) {
    return { [sortBy.substring(1)]: -1 };
  }
  
  return { [sortBy]: sortOrder };
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
      hasPrevPage: page > 1
    }
  };
};

module.exports = {
  parsePaginationParams,
  parseSortParams,
  buildPaginationResponse
};
