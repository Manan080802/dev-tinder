const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { U05, U10, U11, U12, U13, U14 } = require("../messages/user.json");
const Util = require("../utils/response");
const {
  editUserProfile,
  getUserByEmail,
  feedData,
} = require("../services/user");
const ApiError = require("../utils/ApiError");
const User = require("../model/user");
const profileView = catchAsync((req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");

  res.status(httpStatus.OK).send(Util.success(req.user, U05, "U05"));
});

const profileEdit = catchAsync(async (req, res) => {
  const user = req.user;
  const updateBody = req.body;
  updateBody.profileImg = req.file.filename;
  const result = await editUserProfile(user, updateBody);
  if (!result) {
    throw new ApiError(httpStatus.NOT_MODIFIED, U10, "U10");
  }

  res.status(httpStatus.OK).send(Util.success(result, U11, "U11"));
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await getUserByEmail(req.user.email, true);
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, U13, "U13");
  }

  if (await user.isPasswordMatch(newPassword)) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, U14, "U14");
  }
  await Object.assign(user, { password: newPassword }).save();
  res.send(Util.success({}, U12, "U12"));
});

const feed = catchAsync(async (req, res) => {
  const result = await feedData(req);
  res.send(Util.success(result, U05, "U05"));
});
module.exports = { profileView, profileEdit, changePassword, feed };
