const jwt = require("jsonwebtoken");
const ApiError = require("./ApiError");
const httpStatus = require("http-status");
const User = require("../model/user");

const jwtTokenVerify = async (token) => {
  try {
    const userId = await jwt.verify(token, "devTinder");
    if (userId.sub) {
      const user = await User.findOne({ _id: userId.sub }).select(
        "+isDelete -createdOn -updatedOn -__v"
      );
      return user;
    }
  } catch (error) {
    throw new Error("please login");
  }
};
module.exports = { jwtTokenVerify };
