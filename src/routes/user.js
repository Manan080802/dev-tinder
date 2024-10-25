const express = require("express");

const router = express.Router();

const {
  profileView,
  profileEdit,
  changePassword,
} = require("../controller/user");
const {
  profileViewSchema,
  changePasswordSchema,
} = require("../validations/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

// Define the user schema using Joi

router
  .route("/profile")
  .get(auth, profileView)
  .patch(auth, validate(profileViewSchema), profileEdit);

router
  .route("/change-password")
  .post(auth, validate(changePasswordSchema), changePassword);
module.exports = router;
