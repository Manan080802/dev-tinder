const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { U05 } = require("../messages/user.json");
const Util = require("../utils/response");
const profile = catchAsync((req, res) => {
  res.status(httpStatus.OK).send(Util.success(req.user, U05, "U05"));
});

module.exports = { profile };
