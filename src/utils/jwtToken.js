const jwt = require("jsonwebtoken");
const User = require("../model/user");

const jwtTokenVerify = async (token) => {
  try {
    const userId = await jwt.verify(token, process.env.SECRET_KEY);
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
