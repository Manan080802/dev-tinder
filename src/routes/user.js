const express = require("express");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const router = express.Router();
const Util = require("../utils/response");
const Joi = require("joi");
const validate = require("../middleware/validate");
const { profile } = require("../controller/user");
const auth = require("../middleware/auth");

// Define the user schema using Joi

router.route("/profile").get(auth, profile);

module.exports = router;
