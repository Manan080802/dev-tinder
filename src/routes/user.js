const express = require("express");

const router = express.Router();

const {
  profileView,
  profileEdit,
  changePassword,
  feed,
} = require("../controller/user");
const {
  profileViewSchema,
  changePasswordSchema,
  feedSchema,
} = require("../validations/user");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload = require("../utils/multer");
const parseToJson = require("../utils/parseTojson");

// Define the user schema using Joi

router
  .route("/profile")
  .get(auth, profileView)
  .patch(
    auth,
    upload.single("profileImg"),
    parseToJson,
    validate(profileViewSchema),
    profileEdit
  );

router
  .route("/change-password")
  .post(auth, validate(changePasswordSchema), changePassword);

router.route("/feed").get(auth, validate(feedSchema), feed);
module.exports = router;
