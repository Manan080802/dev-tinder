const mongoose = require("mongoose");
const {
  INTERESTED,
  IGNORED,
  ACCEPTED,
  REJECTED,
} = require("../config/constants");
const { C03 } = require("../messages/connection.json");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const options = {
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
};

const schema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      enum: {
        values: [INTERESTED, IGNORED, ACCEPTED, REJECTED],
        message: `{VALUE is incorrect select type.}`,
      },
    },
  },
  options
);

schema.pre("save", function (next) {
  const request = this;
  if (request.fromUserId.equals(request.toUserId)) {
    next(new ApiError(httpStatus.NOT_EXTENDED, C03, "C03"));
  }
  next();
});
const Request = mongoose.model("Request", schema, "Requests");

module.exports = Request;
