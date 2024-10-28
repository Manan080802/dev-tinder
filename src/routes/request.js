const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const { requestSchema, reviewSchema } = require("../validations/request");
const { sendRequest, reviewRequest } = require("../controller/request");
// Define the user schema using Joi

router
  .route("/send/:status/:toUserId")
  .post(auth, validate(requestSchema), sendRequest);

router
  .route("/review/:status/:requestId")
  .post(auth, validate(reviewSchema), reviewRequest);

module.exports = router;
