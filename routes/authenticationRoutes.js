const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Business = require("../models/businessModel");
const ErrorHandler = require("../utils/errorHandler");

//-----------------------------Registration-------------------------

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);

    const businessFields = Object.keys(Business.schema.paths);

    if (businessFields.some((field) => req.body[field])) {
      // Only create the Business and associate it with the User if any business-related data is provided
      const newBusiness = new Business(req.body);

      newBusiness.user = newUser._id;

      newUser.businesses.push(newBusiness._id);

      await newBusiness.save();

      const orderFields = Object.keys(Order.schema.paths);


      if (orderFields.some((field) => req.body[field])) {
        // Create a new Order document for each order in the array
        const newOrder = new Order(req.body);

        newOrder.user = newUser._id;
        newOrder.business = newBusiness._id;

        await newOrder.save();
      }
    }

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const savedUser = await newUser.save();

    res.status(200).send({
      message: "User created successfully",
      success: true,
      token: token,
      user: savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error creating user", success: false });
  }
});

//---------------------Login--------------------------

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
      // return next(new ErrorHandler("User does not exist", 404));
    }

    console.log(req.body);

    const isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or passwrd!" });
    } else {
      // Check if the user is an admin and set the isAdmin flag accordingly
      const isAdmin = user.role === "admin";

      // Generate the token with isAdmin flag included in the payload
      const token = jwt.sign(
        { id: user._id, isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).send({
        message: "Login successful",
        success: true,
        token: token,
        user: user,
      });
    }
  } catch (err) {
    // console.log(e);
    res.status(500).json({ message: "Error logging in", success: false });
  }
});

module.exports = router;
