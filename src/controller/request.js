const catchAsync = require("../utils/catchAsync");
const { getUserById } = require("../services/user");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { U06 } = require("../messages/user.json");
const Request = require("../model/request");
const { checkConnection } = require("../services/request");
const { C01, CO2 } = require("../messages/connection.json");
const Util = require("../utils/response");

const sendRequest = catchAsync(async (req, res) => {
  const { status, toUserId } = req.params;
  const fromUserId = req.user._id;

  const checkedToUserExist = await getUserById(toUserId);
  if (!checkedToUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, U06, "U06");
  }
  const ISCheckConnection = await checkConnection(fromUserId, toUserId);
  if (ISCheckConnection) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, CO2, "C02");
  }
  const result = await Request.create({ fromUserId, toUserId, status });
  res.status(httpStatus.OK).send(Util.success({}, C01, "C01"));
});
module.exports = { sendRequest };
