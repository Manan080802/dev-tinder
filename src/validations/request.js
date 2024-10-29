const Joi = require("joi");
const {
  INTERESTED,
  IGNORED,
  ACCEPTED,
  REJECTED,
} = require("../config/constants");
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

const reviewSchema = {
  params: Joi.object().keys({
    status: Joi.string()
      .trim()
      .valid(ACCEPTED, REJECTED)
      .required()
      .messages({
        "string.empty": "status is required.",
        "any.only": `status must be one of the following: ${ACCEPTED} ${REJECTED}.`,
      }),
    requestId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "ObjectId validation")
      .required(),
  }),
};

const getConnectionSchema = {
  params: Joi.object().keys({
    status: Joi.string()
      .trim()
      .valid(INTERESTED, REJECTED, ACCEPTED)
      .required()
      .messages({
        "string.empty": "status is required.",
        "any.only": `status must be one of the following: ${INTERESTED} ${REJECTED} ${ACCEPTED}.`,
      }),
  }),
  query: Joi.object()
    .keys({
      search: Joi.string().allow(""),
      pageNumber: Joi.number().integer().positive().optional(),
      limit: Joi.number().integer().positive().optional(),
      isAllData: Joi.boolean().valid(true),
    })
    .or("pageNumber", "isAllData")
    .with("pageNumber", "limit") // Requires 'limit' if 'pageNumber' is present
    .with("limit", "pageNumber") // Requires 'pageNumber' if 'limit' is present
    .nand("pageNumber", "isAllData") // 'pageNumber' and 'isAllData' can't exist together
    .nand("limit", "isAllData"),
};

module.exports = { requestSchema, reviewSchema, getConnectionSchema };
