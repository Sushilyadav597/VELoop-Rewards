/**
 * Centralized Error Sanitization Middleware
 * Masks raw database and driver internals (MongoServerError, CastError, etc.)
 */

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.statusCode || (err.status ? err.status : 500);

  // Friendly error message mappings
  let userMessage = err.message || 'An unexpected error occurred while processing your request.';

  // Check for Mongo specific errors
  if (err.name === 'CastError') {
    userMessage = 'Invalid resource identifier provided.';
  } else if (err.code === 11000) {
    userMessage = 'Duplicate record detected. This action cannot be duplicated.';
  } else if (err.name === 'ValidationError') {
    userMessage = Object.values(err.errors).map(e => e.message).join(', ');
  } else if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    userMessage = 'Unable to process your reward at this moment. Please try again.';
  }

  res.status(statusCode).json({
    success: false,
    error: userMessage,
    ...(err.nextClaimAt && { nextClaimAt: err.nextClaimAt }),
    ...(err.cooldownRemainingMs && { cooldownRemainingMs: err.cooldownRemainingMs })
  });
};

module.exports = errorHandler;
