const express = require("express");
const router = express.Router();
const passport = require("passport");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");
const validate = require("../middleware/validate");
const {
  createOrderSchema,
  verifyPaymentSchema,
} = require("../validations/payment.validation");

const isAuthenticated = passport.authenticate("jwt", { session: false });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post(
  "/create-order",
  isAuthenticated,
  validate(createOrderSchema),
  async (req, res) => {
    try {
      const { orderId, paymentMethod, paymentDetails } = req.body;
      const order = await Order.findOne({
        _id: orderId,
        user: req.user.id,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      order.paymentMethod = paymentMethod;
      order.paymentDetails = paymentDetails;

      if (paymentMethod === "cod") {
        order.paymentStatus = "completed";
        await order.save();
        return res.json({
          success: true,
          message: "Order placed with Cash on Delivery",
          orderId: order._id,
        });
      }

      
      const razorpayOrder = await razorpay.orders.create({
        amount: order.totalAmount * 100, 
        currency: "INR",
        receipt: orderId.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating payment order",
        error: error.message,
      });
    }
  }
);

router.post(
  "/verify",
  isAuthenticated,
  validate(verifyPaymentSchema),
  async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
        req.body;

      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      const isAuthentic = expectedSignature === razorpaySignature;

      if (!isAuthentic) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      const order = await Order.findOneAndUpdate(
        {
          _id: orderId,
          user: req.user.id,
          razorpayOrderId,
        },
        {
          paymentStatus: "completed",
          razorpayPaymentId,
          razorpaySignature,
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({
        message: "Payment verified successfully",
        order,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error verifying payment", error: error.message });
    }
  }
);

router.get("/status/:orderId", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payment status", error: error.message });
  }
});


router.post("/verify-upi", isAuthenticated, async (req, res) => {
  try {
    const { paymentIntentId, upiId } = req.body;

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: paymentIntentId, user: req.user.id },
      { paymentStatus: "completed", paymentDetails: { upiId } },
      { new: true }
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "UPI payment successful", order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "UPI payment failed",
      error: error.message,
    });
  }
});


router.post("/create-intent", isAuthenticated, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, 
      currency: currency || "INR",
    });

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating payment intent",
      error: error.message,
    });
  }
});
module.exports = router;
