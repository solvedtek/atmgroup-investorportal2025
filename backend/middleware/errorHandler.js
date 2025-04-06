// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  // Log the full stack trace for debugging purposes
  if (err.stack) {
    console.error('Stack:', err.stack);
  }

  // Determine the status code: use the error's status code if available, otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Prepare the response body
  const responseBody = {
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal Server Error' // Generic message for 500 errors in production
      : err.message || 'An unexpected error occurred', // Use error message or a default
  };

  // Optionally include stack trace in development environment
  if (process.env.NODE_ENV !== 'production') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;