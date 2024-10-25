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

module.exports = { profileViewSchema }; // Export the Joi schema directly
