const express = require("express");
const router = express.Router();
const passport = require("passport");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const validate = require("../middleware/validate");
const mongoose = require("mongoose");

const {
  orderSchema,
  orderStatusSchema,
} = require("../validations/order.validation");

const isAuthenticated = passport.authenticate("jwt", { session: false });

router.post("/", isAuthenticated, validate(orderSchema), async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount } = req.body;

    let address = deliveryAddress;
    if (!address) {
      const user = await User.findById(req.user.id);
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);
      if (!defaultAddress) {
        return res
          .status(400)
          .json({ message: "No delivery address provided" });
      }
      address = defaultAddress;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      deliveryAddress: address,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

router.get("/:orderId", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    }).populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
});

router.patch(
  "/:orderId/status",
  isAuthenticated,
  validate(orderStatusSchema),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { orderStatus } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { orderStatus },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating order status", error: error.message });
    }
  }
);

router.post("/:orderId/cancel", isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled at this stage" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
});
// orders.route.js

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const formattedItems = req.body.items.map((item) => ({
      itemId: item.itemId,
      menuItem: item.menuItem,
      quantity: item.quantity,
      price: item.price,
    }));

    const deliveryAddress = {
      street: req.body.deliveryAddress.street || "",
      city: req.body.deliveryAddress.city || "",
      state: req.body.deliveryAddress.state || "",
      zipCode: req.body.deliveryAddress.zipCode || "",
    };

    const order = new Order({
      user: req.user._id,
      items: formattedItems,
      totalAmount: req.body.totalAmount,
      deliveryAddress,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      razorpayPaymentId: req.body.razorpayPaymentId,
      razorpayOrderId: req.body.razorpayOrderId,
      razorpaySignature: req.body.razorpaySignature,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Error creating order",
      error: error.message,
    });
  }
});

module.exports = router;
