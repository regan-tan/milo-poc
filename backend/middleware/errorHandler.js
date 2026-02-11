/**
 * Global error-handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
const errorHandler = (err, req, res, _next) => {
  console.error('[Error]', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export default errorHandler;
