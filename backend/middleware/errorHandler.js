// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);
  if (err.stack) {
    console.error('Stack:', err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';
  let details = undefined;

  // Handle express-validator validation errors
  if (Array.isArray(err.errors)) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors.map((e) => ({
      field: e.param,
      message: e.msg,
    }));
  }

  const responseBody = {
    message:
      statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : message,
  };

  if (details) {
    responseBody.details = details;
  }

  if (process.env.NODE_ENV !== 'production') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;
