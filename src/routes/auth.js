const express = require("express");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const router = express.Router();
const Util = require("../utils/response");
const Joi = require("joi");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/auth");
const { signup, login } = require("../controller/auth");

// Define the user schema using Joi

router.route("/signup").post(validate(registerSchema), signup);

router.route("/login").post(validate(loginSchema),login);

module.exports = router;
