const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { v4: uuid } = require("uuid");
const Business = require("../models/businessModel");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const addOnProductsModel = require("../models/addOnModel");
const packageModel = require("../models/packageModel");
const orderModel = require("../models/orderModel");

exports.getUserAccount = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User details not found", 404));
  }

  res.status(200).json({ success: true, user: user });
});

exports.updateUserAccount = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const updates = req.body;

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    message: "Account settings updated successfully",
    success: true,
    user: user,
  });
});

exports.createNewBusiness = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  // console.log("new businessss ", req.body);
  const user = await User.findById(userId);

  // // const orderFields = Object.keys(Order.schema.paths);

  // // if (orderFields.some((field) => req.body[field])) {
  // //   // Create a new Order if related fields are passed else skipped
  // //   const newOrder = new Order(req.body);

  // //   newOrder.user = user._id;
  // //   newOrder.business = newBusiness._id;

  // //   await newOrder.save();
  // // }

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

  const newBusiness = new Business(req.body);

  newBusiness.user = user._id;

  newBusiness.productsIncluded = {
    productName: productsIncluded,
  };

  user.businesses.push(newBusiness._id);

  // console.log("total ", orderTotalAmount);
  // console.log("prods inclu ", productsIncluded);

  const unique_id = uuid();
  const orderId = unique_id.slice(0, 8);

  const newOrder = await orderModel.create({
    user: userId,
    business: newBusiness._id,
    orderId: "#" + orderId,
    products: {
      productName: productsIncluded,
      package: req.body.package,
    },
    amount: orderTotalAmount,
  });

  await newOrder.save();

  const updatedUser = await user.save();
  const business = await newBusiness.save();

  res.status(201).json({
    message: "New business added!",
    success: true,
    business: business,
    user: updatedUser,
  });
});

exports.getAllBusinessAccount = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const business = await Business.find({ user: userId }).sort({
    createdAt: -1,
  });

  if (!business) {
    return next(new ErrorHandler("No Businesses found", 404));
  }

  res.status(200).json({ success: true, business: business });
});

exports.getBusinessAccount = catchAsyncError(async (req, res, next) => {
  const businessId = req.params.bid;

  const business = await Business.findById(businessId);

  if (!business) {
    return next(new ErrorHandler("Business information not found", 404));
  }

  res.status(200).json({ success: true, business: business });
});

exports.updateBusinessAccount = catchAsyncError(async (req, res, next) => {
  // const userId = req.user.id;
  const businessId = req.params.bid;
  const updates = req.body;

  const business = await Business.findByIdAndUpdate(businessId, updates, {
    new: true,
    runValidators: true,
  });

  if (!business) {
    return next(new ErrorHandler("Business not found", 404));
  }

  res.status(200).json({
    message: "Business updated successfully",
    success: true,
    business: business,
  });
});

exports.getAllOrderHistory = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.userId;
    const orders = await Order.findOne(
      // { user: userId },
      { business: req.params.bid }
    )
      .populate("user")
      .populate("business")
      .populate("products.package");

    if (!orders) {
      return next(new ErrorHandler("No Order history", 404));
    }

    res.status(200).json({ success: true, orders: orders });
  } catch (error) {
    console.log(error);
  }
});

exports.getOrderHistory = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.oid;
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorHandler("No Order found", 404));
  }

  res.status(200).json({ success: true, order: order });
});

exports.getBusinessOrderHistory = catchAsyncError(async (req, res, next) => {
  // const userId = req.user.id;
  const businessId = req.params.bid;
  const orders = await Order.find({ business: businessId });

  if (orders.length == 0) {
    return next(
      new ErrorHandler("Order associated with business not found", 404)
    );
  }

  res.status(200).json({
    success: true,
    orders: orders,
  });
});

exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const businessId = req.params.bid;
  const order = req.body;

  const business = await Business.findById(businessId);
  if (!business) {
    return next(new ErrorHandler("No Business found", 404));
  }

  const newOrder = new Order(order);
  newOrder.user = userId;
  newOrder.business = businessId;
  await newOrder.save();

  res
    .status(200)
    .json({ message: "new order placed", success: true, order: order });
});
