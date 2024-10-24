const User = require("../model/user");

const getUserByEmail = async (email, isPassword) => {
  return User.findOne({ email: email, isDelete: false }).select(
    `${isPassword ? "+password" : "-password"} -__v -createdOn -updatedOn`
  );
};
module.exports = { getUserByEmail };
