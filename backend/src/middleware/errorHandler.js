// ==============================================
// Centralized Error Handling Middleware
// Har route ka error yahan aakar handle hoga
// ==============================================

/* 404 - Route not found handler */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/* Global error handler - sabse last me use hota hai */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Multer-specific errors ko friendly message do
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = `File too large. Max allowed size is ${process.env.MAX_FILE_SIZE_MB || 500}MB.`;
    }
  }

  err.message = message;

  console.error(`❌ Error: ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Development me stack trace bhejo, production me nahi
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
