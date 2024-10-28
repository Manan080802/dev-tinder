const Request = require("../model/request");
const { INTERESTED } = require("../config/constants");

const checkConnection = (fromUserId, toUserId) => {
  return Request.findOne({
    $or: [
      {
        fromUserId,
        toUserId,
      },
      {
        toUserId: fromUserId,
        fromUserId: toUserId,
      },
    ],
  });
};

const getConnection = (requestId, toUserId) => {
  return Request.findOne({
    _id: requestId,
    status: INTERESTED,
    toUserId: toUserId,
  });
};
module.exports = { checkConnection, getConnection };
