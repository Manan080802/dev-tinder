const jwt = require("jsonwebtoken");
const { jwtTokenVerify } = require("../utils/jwtToken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { U03, U04, U06 } = require("../messages/user.json");
const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user = await jwtTokenVerify(token);
    if (!user) {
      next(new ApiError(httpStatus.NOT_FOUND, U06, "U06"));
    }
    if (user && user.isDelete) {
      next(new ApiError(httpStatus.NOT_FOUND, U04, "U04"));
    }
    if (user && !user.isActive) {
      next(new ApiError(httpStatus.FORBIDDEN, U03, "U03"));
    }

    delete user._doc.isActive;
    delete user._doc.isDelete;
    req.user = user;
    next();
  } catch (error) {
    next(new Error(error.message));
  }
};
module.exports = auth;
