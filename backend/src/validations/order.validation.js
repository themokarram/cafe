const Joi = require("joi");

const orderItemSchema = Joi.object({
  menuItem: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Menu item ID is required",
      "string.pattern.base": "Invalid menu item ID format",
    }),
  quantity: Joi.number().required().min(1).messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
  }),
});

const orderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).required().min(1).messages({
    "array.base": "Items must be an array",
    "array.min": "Order must contain at least one item",
  }),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string()
      .required()
      .pattern(/^[0-9]{6}$/),
  }).optional(),
  totalAmount: Joi.number().required().min(0).messages({
    "number.base": "Total amount must be a number",
    "number.min": "Total amount cannot be negative",
  }),
});

const orderStatusSchema = Joi.object({
  orderStatus: Joi.string()
    .required()
    .valid(
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled"
    )
    .messages({
      "string.empty": "Order status is required",
      "any.only": "Invalid order status",
    }),
});

module.exports = {
  orderSchema,
  orderStatusSchema,
};
