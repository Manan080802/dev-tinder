const catchAsync = require("../utils/catchAsync");
const { getUserById } = require("../services/user");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { U06, U05 } = require("../messages/user.json");
const Request = require("../model/request");
const {
  checkConnection,
  getConnection,
  getConnectionCounts,
} = require("../services/request");
const { C01, CO2, C04, C05 } = require("../messages/connection.json");
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

const reviewRequest = catchAsync(async (req, res) => {
  const { status, requestId } = req.params;
  const toUserId = req.user._id;
  const getRequest = await getConnection(requestId, toUserId);
  if (!getRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, C04, "C04");
  }

  await Object.assign(getRequest, { status: status }).save();

  res.status(httpStatus.ACCEPTED).send(Util.success({}, C05, "C05"));
});

const getConnections = catchAsync(async (req, res) => {
  const connectionCounts = await getConnectionCounts(req);

  res.send(Util.success(connectionCounts, U05, "U05"));
});
module.exports = { sendRequest, reviewRequest, getConnections };
