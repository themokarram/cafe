const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.model");
const validate = require("../middleware/validate");
const {
  profileUpdateSchema,
  addressSchema,
} = require("../validations/user.validation");

const isAuthenticated = passport.authenticate("jwt", { session: false });

router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

router.put(
  "/profile",
  isAuthenticated,
  validate(profileUpdateSchema),
  async (req, res) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone },
        { new: true }
      ).select("-password");
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  }
);

router.post(
  "/addresses",
  isAuthenticated,
  validate(addressSchema),
  async (req, res) => {
    try {
      const { street, city, state, zipCode, isDefault } = req.body;

      if (isDefault) {
        await User.updateOne(
          { _id: req.user.id, "addresses.isDefault": true },
          { $set: { "addresses.$.isDefault": false } }
        );
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { addresses: { street, city, state, zipCode, isDefault } } },
        { new: true }
      ).select("-password");

      res.json(user.addresses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding address", error: error.message });
    }
  }
);

router.get("/addresses", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");
    res.json(user.addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
});

router.put(
  "/addresses/:addressId",
  isAuthenticated,
  validate(addressSchema),
  async (req, res) => {
    try {
      const { street, city, state, zipCode, isDefault } = req.body;

      if (isDefault) {
        await User.updateOne(
          { _id: req.user.id, "addresses.isDefault": true },
          { $set: { "addresses.$.isDefault": false } }
        );
      }

      const user = await User.findOneAndUpdate(
        {
          _id: req.user.id,
          "addresses._id": req.params.addressId,
        },
        {
          $set: {
            "addresses.$.street": street,
            "addresses.$.city": city,
            "addresses.$.state": state,
            "addresses.$.zipCode": zipCode,
            "addresses.$.isDefault": isDefault,
          },
        },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "Address not found" });
      }

      res.json(user.addresses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating address", error: error.message });
    }
  }
);

router.delete("/addresses/:addressId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    ).select("-password");

    res.json(user.addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
});

module.exports = router;
