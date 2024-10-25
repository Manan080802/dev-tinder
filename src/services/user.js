const User = require("../model/user");

const getUserByEmail = async (email, isPassword) => {
  return User.findOne({ email: email, isDelete: false }).select(
    `${isPassword ? "+password" : "-password"} -__v -createdOn -updatedOn`
  );
};

const editUserProfile = async (user, updateBody) => {
  return Object.assign(user, updateBody).save();
};
module.exports = { getUserByEmail, editUserProfile };
