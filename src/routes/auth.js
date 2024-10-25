const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validations/auth");
const { signup, login, logout } = require("../controller/auth");
const auth = require("../middleware/auth");

// Define the user schema using Joi

router.route("/signup").post(validate(registerSchema), signup);

router.route("/login").post(validate(loginSchema), login);

router.route("/logout").get(auth, logout);

module.exports = router;
