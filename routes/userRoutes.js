const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Business = require("../models/businessModel");
//const { auth } = require('../middlewares/authMiddleware');

//---------------------User--------------------//

//user account settings GET

router.get("/dashboard/account-settings", async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User details not found!" });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching user information", success: false });
  }
});

//user account setting PATCH

router.patch("/dashboard/account-settings", async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "Account settings updated successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating account settings", success: false });
  }
});

//--------------------Business----------------------//

//user business-settings Post

router.post("/dashboard/business-settings/new-business", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const newBusiness = new Business(req.body);

    newBusiness.user = user._id;

    user.businesses.push(newBusiness._id);

    const updatedUser = await user.save();
    const business = await newBusiness.save();

    res.status(201).json({
      message: "New business added!",
      success: true,
      business: business,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating business information", success: false });
  }
});

//user business-settings GET

router.get("/dashboard/business-settings", async (req, res) => {
  try {
    const userId = req.user.id;

    const business = await Business.find({ user: userId });

    if (!business) {
      return res
        .status(404)
        .json({ message: "User related business not found!" });
    }

    res.status(200).json({ success: true, business: business });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching business information", success: false });
  }
});

router.get("/dashboard/business-settings/:bid", async (req, res) => {
  try {
    const businessId = req.params.bid;

    const business = await Business.findById(businessId);

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business information not found!" });
    }

    res.status(200).json({ success: true, business: business });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error fetching business information", success: false });
  }
});

//user business-settings PATCh

router.patch("/dashboard/business-settings/:bid", async (req, res) => {
  try {
    // const userId = req.user.id;
    const businessId = req.params.bid;
    const updates = req.body;

    const business = await Business.findByIdAndUpdate(businessId, updates, {
      new: true,
      runValidators: true,
    });

    if (!business) {
      return res
        .status(404)
        .json({ message: "Business not found!", success: false });
    }

    res.status(200).json({
      message: "Business updated successfully",
      success: true,
      business: business,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating business information", success: false });
  }
});

router.get("/dashboard/order-history", async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId });

    if (order.length == 0) {
      return res
        .status(404)
        .json({ message: "No Order history", success: false });
    }

    res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching order history", success: false });
  }
});

router.get("/dashboard/business-settings/:bid/orders", async (req, res) => {
  try {
    // const userId = req.user.id;
    const businessId = req.params.bid;
    const orders = await Order.find({ business: businessId });

    if (orders.length == 0) {
      return res.status(404).json({
        message: "Order associated with business not found",
        success: false,
      });
    }

    res.status(200).send({
      message: "Business updated successfully",
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error fetching business orders", success: false });
  }
});

//----for placing new orders for a particular business------

router.post("/dashboard/new-order/:bid", async (req, res) => {
  try {
    const userId = req.user.id;
    const businessId = req.params.bid;
    const order = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      return res
        .status(404)
        .json({ message: "No business found", success: false });
    }

    const newOrder = new Order(order);
    newOrder.user = userId;
    newOrder.business = businessId;
    await newOrder.save();

    res
      .status(200)
      .json({ message: "new order placed", success: true, order: order });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating new order", success: false });
  }
});

module.exports = router;
