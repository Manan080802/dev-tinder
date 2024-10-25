const Joi = require("joi");
const { MALE, OTHER, FEMALE } = require("../config/constants");
const today = new Date();
const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
// Define the validation schema
const profileViewSchema = {
  body: Joi.object().keys({
    firstName: Joi.string().min(3).trim().optional(),
    lastName: Joi.string().min(3).trim().optional(),
    gender: Joi.string()
      .trim()
      .valid(MALE, FEMALE, OTHER)
      .optional()
      .messages({
        "string.empty": "Gender is required.",
        "any.only": `Gender must be one of the following: ${MALE} ${FEMALE} ${OTHER}`,
      }),
    dob: Joi.string()
      .trim()
      .optional() // Make it a required field
      .custom((value, helpers) => {
        const date = new Date(value); // Convert the string to a Date object

        // Check if the date is valid
        if (isNaN(date.getTime())) {
          return helpers.error("date.base"); // Invalid date
        }

        // Check if the person is at least 18 years old
        if (date > eighteenYearsAgo) {
          return helpers.error("date.greater"); // Not old enough
        }

        return value; // Return the valid value if all checks pass
      })
      .messages({
        "string.empty": "Date of birth is required.",
        "date.base": "Date of birth must be a valid date.",
        "date.greater": "You must be at least 18 years old.",
      }),
    skill: Joi.array()
      .items(Joi.string().min(2))
      .min(1) // Each skill must be a non-empty string
      .optional() // The array is optional
      .messages({
        "array.base": "Skills must be an array of strings.",
        "array.includes": "Each skill must be a non-empty string.",
        "string.min": "Each skill must be at least 4 characters long.",
      }),
  }),
};

const changePasswordSchema = {
  body: Joi.object().keys({
    oldPassword: Joi.string()
      .min(8) // Minimum length of 8 characters
      .max(30) // Optional maximum length of 30 characters
      .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
      .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
      .pattern(new RegExp("(?=.*[0-9])")) // At least one digit
      .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
      .required()
      .messages({
        "string.min": "Old password must be at least 8 characters long.",
        "string.pattern.base":
          "Old password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
        "any.required": "Old password is required.",
      }),
    newPassword: Joi.string()
      .min(8) // Minimum length of 8 characters
      .max(30) // Optional maximum length of 30 characters
      .pattern(new RegExp("(?=.*[a-z])")) // At least one lowercase letter
      .pattern(new RegExp("(?=.*[A-Z])")) // At least one uppercase letter
      .pattern(new RegExp("(?=.*[0-9])")) // At least one digit
      .pattern(new RegExp("(?=.*[!@#$%^&*])")) // At least one special character
      .required()
      .messages({
        "string.min": "New password must be at least 8 characters long.",
        "string.pattern.base":
          "New password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
        "any.required": "New password is required.",
      }),
  }),
};
module.exports = { profileViewSchema, changePasswordSchema }; // Export the Joi schema directly
