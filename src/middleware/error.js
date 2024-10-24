const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Utils = require("../utils/response");

const errorConverter = async (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    const messageCode = error.messageCode || "";
    const result = error.result || {};
    error = new ApiError(statusCode, message, messageCode, result);
  }
  next(error);
};
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, messageCode, result } = err;

  res.locals.errorMessage = err.message;
  return res
    .status(statusCode || httpStatus.BAD_GATEWAY)
    .send(Utils.error(result, message, messageCode));
};
module.exports = { errorConverter, errorHandler };
