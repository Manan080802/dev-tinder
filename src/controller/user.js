const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { U05, U10, U11 } = require("../messages/user.json");
const Util = require("../utils/response");
const { editUserProfile } = require("../services/user");
const ApiError = require("../utils/ApiError");
const profileView = catchAsync((req, res) => {
  res.status(httpStatus.OK).send(Util.success(req.user, U05, "U05"));
});

const profileEdit = catchAsync(async (req, res) => {
  const user = req.user;
  const updateBody = req.body;
  const result = await editUserProfile(user, updateBody);
  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, U10, "U10");
  }

  res.status(httpStatus.OK).send(Util.success({}, U11, "U11"));
});

module.exports = { profileView, profileEdit };
