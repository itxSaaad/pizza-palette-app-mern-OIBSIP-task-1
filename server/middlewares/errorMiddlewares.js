const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware
};

const errorHandler = (err, req, res, next) => {
  // Determine the appropriate status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  const response = {
    message: err.message, // Error message
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack; // Error stack trace
  }

  res.json(response); // Send JSON response
};

module.exports = { notFound, errorHandler };
