const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Util = require("../utils/response");
const User = require("../model/user");
const userService = require("../services/user");
const ApiError = require("../utils/ApiError");
const { U01, U02, U07, U06, U03 } = require("../messages/user.json");
const signup = catchAsync(async (req, res) => {
  const { email } = req.body;
  const userExist = await userService.getUserByEmail(email, true);

  if (userExist) {
    throw new ApiError(httpStatus.CONFLICT, U02, "U02");
  }

  const result = await User.create(req.body);

  if (result._doc.password || result._doc.isDelete) {
    delete result._doc.password;
    delete result._doc.isDelete;
  }
  if (result) {
    delete result._doc.__v;
    delete result._doc.createdOn;
    delete result._doc.updatedOn;
  }

  const token = await result.getToken();
  res.cookie("token", token);

  res.status(httpStatus.CREATED).send(Util.success(result, U01, "U01"));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email, true);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, U06, "U06");
  }
  if (user && !user.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, U03, "U03");
  }

  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "user is not exist",
      "user is not exit"
    );
  }

  if (user && user.password) {
    delete user._doc.password;
  }
  const token = await user.getToken();
  res.cookie("token", token);

  res.status(httpStatus.OK).send(Util.success(user, U07, "U07"));
});

module.exports = { signup, login };
