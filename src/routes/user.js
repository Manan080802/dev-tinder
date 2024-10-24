const express = require("express");

const router = express.Router();

const { profile } = require("../controller/user");
const auth = require("../middleware/auth");

// Define the user schema using Joi

router.route("/profile").get(auth, profile);

module.exports = router;
