const Joi = require("joi");

const createOrderSchema = Joi.object({
  orderId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Order ID is required",
      "string.pattern.base": "Invalid order ID format",
    }),
  paymentMethod: Joi.string().valid("card", "upi", "cod").required(),
  paymentDetails: Joi.object().optional(),
});

const verifyPaymentSchema = Joi.object({
  razorpayOrderId: Joi.string().required().messages({
    "string.empty": "Razorpay order ID is required",
  }),
  razorpayPaymentId: Joi.string().required().messages({
    "string.empty": "Razorpay payment ID is required",
  }),
  razorpaySignature: Joi.string().required().messages({
    "string.empty": "Razorpay signature is required",
  }),
  orderId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.empty": "Order ID is required",
      "string.pattern.base": "Invalid order ID format",
    }),
});

module.exports = {
  createOrderSchema,
  verifyPaymentSchema,
};
