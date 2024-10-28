const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const { requestSchema } = require("../validations/request");
const { sendRequest } = require("../controller/request");
// Define the user schema using Joi

router
  .route("/send/:status/:toUserId")
  .post(auth, validate(requestSchema), sendRequest);

module.exports = router;
