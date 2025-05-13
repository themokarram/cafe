const express = require("express");
const router = express.Router();
const DeliveryAddress = require("../models/DeliveryAddress");
const auth = require("../middleware/auth");

// Get all addresses for a user
router.get("/", auth, async (req, res) => {
  try {
    const addresses = await DeliveryAddress.find({ user: req.user._id });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new address
router.post("/", auth, async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      user: req.user._id, // Ensure user ID is set
    };

    const address = new DeliveryAddress(addressData);
    await address.save();
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update an address
router.put("/:id", auth, async (req, res) => {
  try {
    const address = await DeliveryAddress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete an address
router.delete("/:id", auth, async (req, res) => {
  try {
    const address = await DeliveryAddress.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Set default address
router.patch("/:id/set-default", auth, async (req, res) => {
  try {
    const address = await DeliveryAddress.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
