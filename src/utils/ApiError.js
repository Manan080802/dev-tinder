class ApiError extends Error {
  constructor(
    statusCode,
    message,
    messageCode,
    result = {},
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.messageCode = messageCode;
    this.statusCode = statusCode;
    this.result = result;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
