const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = err.status || 500;
  let response = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    response.error = {
      code: 'VALIDATION_ERROR',
      message: err.message
    };
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    response.error = {
      code: 'INVALID_TOKEN',
      message: 'Invalid token'
    };
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    response.error = {
      code: 'TOKEN_EXPIRED',
      message: 'Token has expired'
    };
  } else if (err.code === 11000) {
    status = 409;
    response.error = {
      code: 'DUPLICATE_ENTRY',
      message: 'Resource already exists'
    };
  }

  // In development, include error stack
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;