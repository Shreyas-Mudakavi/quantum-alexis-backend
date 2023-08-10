const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const businessModel = require("../models/businessModel");
const orderModel = require("../models/orderModel");
const packageModel = require("../models/packageModel");
const addOnProductsModel = require("../models/addOnModel");

exports.checkEmail = catchAsyncError(async (req, res, next) => {
  const userExists = await userModel.findOne({ email: req.body.email });
  if (userExists) {
    return next(new ErrorHandler("Email address already in use.", 409));
  }

  res.status(200).json({
    message: "User available",
    success: true,
  });
});

exports.register = catchAsyncError(async (req, res, next) => {
  const userExists = await userModel.findOne({ email: req.body.email });
  if (userExists) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.password = hashedPassword;

  // console.log("register ", req.body);
  // console.log("register prodss ", req.body.productsIncluded);

  let orderTotalAmount = 0;
  let productsIncluded = [];

  const packageInfo = await packageModel.findOne({ _id: req.body.package });

  orderTotalAmount = orderTotalAmount + packageInfo.price;

  if (req.body.productsIncluded.einDocsId !== "") {
    const addOnEin = await addOnProductsModel.findOne(
      { "productDetails._id": req.body.productsIncluded.einDocsId },
      {
        productDetails: {
          $elemMatch: { _id: req.body.productsIncluded.einDocsId },
        },
      }
    );

    orderTotalAmount = orderTotalAmount + addOnEin.productDetails[0]?.amount;
    productsIncluded.push(addOnEin.productDetails[0]);
  }

  if (req.body.productsIncluded.llcDocsId !== "") {
    const addOn = await addOnProductsModel.findOne(
      { "productDetails._id": req.body.productsIncluded.llcDocsId },
      {
        productDetails: {
          $elemMatch: { _id: req.body.productsIncluded.llcDocsId },
        },
      }
    );

    orderTotalAmount = orderTotalAmount + addOn.productDetails[0]?.amount;
    productsIncluded.push(addOn.productDetails[0]);
  }

  if (req.body.productsIncluded.operatingAgreeId !== "") {
    const addOn = await addOnProductsModel.findOne(
      { "productDetails._id": req.body.productsIncluded.operatingAgreeId },
      {
        productDetails: {
          $elemMatch: { _id: req.body.productsIncluded.operatingAgreeId },
        },
      }
    );

    orderTotalAmount = orderTotalAmount + addOn.productDetails[0]?.amount;
    productsIncluded.push(addOn.productDetails[0]);
  }

  if (req.body.productsIncluded.onlineToolsId !== "") {
    const addOn = await addOnProductsModel.findOne(
      { "productDetails._id": req.body.productsIncluded.onlineToolsId },
      {
        productDetails: {
          $elemMatch: { _id: req.body.productsIncluded.onlineToolsId },
        },
      }
    );

    orderTotalAmount = orderTotalAmount + addOn.productDetails[0]?.amount;
    productsIncluded.push(addOn.productDetails[0]);
  }

  if (req.body.productsIncluded.complianceId !== "") {
    const addOn = await addOnProductsModel.findOne(
      { "productDetails._id": req.body.productsIncluded.complianceId },
      {
        productDetails: {
          $elemMatch: { _id: req.body.productsIncluded.complianceId },
        },
      }
    );

    orderTotalAmount = orderTotalAmount + addOn.productDetails[0]?.amount;
    productsIncluded.push(addOn.productDetails[0]);
  }

  const newUser = new userModel(req.body);

  const newBusiness = new businessModel(req.body);

  newBusiness.user = newUser._id;

  newUser.businesses.push(newBusiness._id);

  newBusiness.productsIncluded = {
    productName: productsIncluded,
  };

  await newBusiness.save();

  const unique_id = uuid();
  const orderId = unique_id.slice(0, 8);

  // console.log("total ", orderTotalAmount);
  // console.log("prods inclu ", productsIncluded);

  const newOrder = await orderModel.create({
    user: newUser._id,
    business: newBusiness._id,
    orderId: "#" + orderId,
    products: {
      productName: productsIncluded,
      package: req.body.package,
    },
    amount: orderTotalAmount,
  });

  await newOrder.save();

  const savedUser = await newUser.save();

  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    message: "User created successfully",
    success: true,
    token: token,
    user: savedUser,
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    //return res.status(404).json({ message: "User does not exist!" });
    return next(new ErrorHandler("Invalid email or password.", 404));
  }

  const isMatch = bcrypt.compareSync(req.body.password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  } else {
    // Check if the user is an admin and set the isAdmin flag accordingly
    const isAdmin = user.role === "admin";

    // Generate the token with isAdmin flag included in the payload
    const token = jwt.sign(
      { userId: user._id, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      user: user,
    });
  }

  // console.log(e);
  //res.status(500).json({ message: "Error logging in", success: false });
});
