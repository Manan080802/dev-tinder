const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const {
  requestSchema,
  reviewSchema,
  getConnectionSchema,
} = require("../validations/request");
const {
  sendRequest,
  reviewRequest,
  getConnections,
} = require("../controller/request");
// Define the user schema using Joi

router
  .route("/send/:status/:toUserId")
  .post(auth, validate(requestSchema), sendRequest);

router
  .route("/review/:status/:requestId")
  .post(auth, validate(reviewSchema), reviewRequest);

router
  .route("/get-connection/:status")
  .get(auth, validate(getConnectionSchema), getConnections);

module.exports = router;
