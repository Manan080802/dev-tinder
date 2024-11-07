const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const {
  requestSchema,
  reviewSchema,
  getConnectionSchema, 
  getAcceptedSchema
} = require("../validations/request");
const {
  sendRequest,
  reviewRequest,
  getConnections,
  getAcceptedConnections
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

router.route("/get-accepted-connection").get(auth,validate(getAcceptedSchema),getAcceptedConnections)

module.exports = router;
