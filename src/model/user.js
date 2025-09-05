const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { MALE, FEMALE, OTHER } = require("../config/constants");
const validator = require("validator");
const { use } = require("../routes/auth");
const { type } = require("os");
const { string } = require("joi");
const options = {
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
};

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    gender: {
      type: String,
      enum: [MALE, FEMALE, OTHER],
      trim: true,
    },
    dob: {
      type: Date,
    },
    skill: {
      type: [String],
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
      select: false,
    },
    profileImg: {
      type: String,
    },
  },
  options
);

schema.methods.getToken = async function () {
  const user = this;
  const token = await jwt.sign({ sub: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const round = Number(process.env.ROUND);
    user.password = await bcrypt.hash(user.password, round);
  }
  next();
});
schema.index({ firstName: 1, lastName: 1 });
const User = mongoose.model("User", schema, "Users");

module.exports = User;
