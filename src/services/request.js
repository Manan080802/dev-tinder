const Request = require("../model/request");

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
module.exports = {checkConnection}
