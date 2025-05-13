const Joi = require("joi");

const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Please provide a valid 10-digit phone number",
    }),
});

const addressSchema = Joi.object({
  street: Joi.string().required().min(5).max(100).messages({
    "string.empty": "Street address is required",
    "string.min": "Street address must be at least 5 characters long",
    "string.max": "Street address cannot exceed 100 characters",
  }),
  city: Joi.string().required().min(2).max(50).messages({
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters long",
    "string.max": "City cannot exceed 50 characters",
  }),
  state: Joi.string().required().min(2).max(50).messages({
    "string.empty": "State is required",
    "string.min": "State must be at least 2 characters long",
    "string.max": "State cannot exceed 50 characters",
  }),
  zipCode: Joi.string()
    .required()
    .pattern(/^[0-9]{6}$/)
    .messages({
      "string.empty": "ZIP code is required",
      "string.pattern.base": "Please provide a valid 6-digit ZIP code",
    }),
  isDefault: Joi.boolean(),
});

module.exports = {
  profileUpdateSchema,
  addressSchema,
};
