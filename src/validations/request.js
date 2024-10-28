const Joi = require("joi");
const { INTERESTED, IGNORED } = require("../config/constants");
const mongoose = require("mongoose");

const requestSchema = {
  params: Joi.object().keys({
    status: Joi.string()
      .trim()
      .valid(INTERESTED, IGNORED)
      .required()
      .messages({
        "string.empty": "status is required.",
        "any.only": `status must be one of the following: ${INTERESTED} ${IGNORED}.`,
      }),
    toUserId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
      .required(),
  }),
};

module.exports = { requestSchema }; // Export the Joi schema directly
