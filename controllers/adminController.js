const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const orderModel = require("../models/orderModel");
const businessModel = require("../models/businessModel");
const packageModel = require("../models/packageModel");
const catchAsyncError = require("../utils/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");

exports.getStatistics = catchAsyncError(async (req, res, next) => {
  const { time } = req.params;
  const date = new Date();
  date.setHours(24, 0, 0, 0);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  let startDate = new Date(date.getFullYear(), 0, 1);
  var days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  var week = Math.ceil(days / 7);

  if (time == "all") {
    const users = await userModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const businesses = await businessModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const orders = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const payments = await orderModel.aggregate([
      {
        $project: {
          amount: 1,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const dailyUsers = await userModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyBusinesses = await businessModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyOrders = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyPayments = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({
      users: users,
      businesses: businesses,
      payments: payments,
      orders: orders,
      dailyUsers,
      dailyBusinesses,
      dailyOrders,
      dailyPayments,
    });
  }

  if (time == "daily") {
    const users = await userModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 1 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const businesses = await businessModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 1 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const orders = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 1 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const payments = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 1 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const dailyUsers = await userModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 6 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyBusinesses = await businessModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 6 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyOrders = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 6 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyPayments = await orderModel.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              "$createdAt",
              { $dateSubtract: { startDate: date, unit: "day", amount: 6 } },
            ],
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.send({
      users: users,
      businesses: businesses,
      payments: payments,
      orders: orders,
      dailyUsers,
      dailyBusinesses,
      dailyOrders,
      dailyPayments,
    });
  }

  if (time == "weekly") {
    const users = await userModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          week: week,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const businesses = await businessModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          week: week,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const payments = await orderModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $match: {
          year: year,
          week: week,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const orders = await orderModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          week: week,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    const dailyUsers = await userModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyBusinesses = await businessModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyOrders = await orderModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyPayments = await orderModel.aggregate([
      {
        $project: {
          week: { $week: "$createdAt" },

          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$week",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.send({
      users: users,
      businesses: businesses,
      payments: payments,
      orders: orders,
      dailyUsers,
      dailyBusinesses,
      dailyOrders,
      dailyPayments,
    });
  }

  if (time == "monthly") {
    const users = await userModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          month: month,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const businesses = await businessModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          month: month,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const orders = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
          month: month,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);
    const payments = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $match: {
          year: year,
          month: month,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const dailyUsers = await userModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyBusinesses = await businessModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyOrders = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const dailyPayments = await orderModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },

          year: { $year: "$createdAt" },
          amount: 1,
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return res.send({
      users: users,
      businesses: businesses,
      payments: payments,
      orders: orders,
      dailyUsers,
      dailyBusinesses,
      dailyOrders,
      dailyPayments,
    });
  }
});

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  // Fetch all users from the database
  const userCount = await userModel.countDocuments();
  const apiFeature = new APIFeatures(
    userModel.find().sort({ createdAt: -1 }),
    req.query
  ).search("firstname");

  let users = await apiFeature.query;
  let filteredUserCount = users.length;
  if (req.query.resultPerPage && req.query.currentPage) {
    apiFeature.pagination();

    // console.log("filteredUserCount", filteredUserCount);
    users = await apiFeature.query.clone();
  }

  if (!users) {
    return next(new ErrorHandler("No Users found", 404));
  }

  res.status(200).json({
    success: true,
    users: users,
    userCount: userCount,
    filteredUserCount: filteredUserCount,
  });
});

// exports.createNewUser = catchAsyncError(async (req, res, next) => {
//   const userExists = await userModel.findOne({ email: req.body.email });
//   if (userExists) {
//     return next(new ErrorHandler("User already exsists", 409));
//   }

//   const password = req.body.password;
//   const salt = bcrypt.genSaltSync(10);
//   const hashedPassword = bcrypt.hashSync(password, salt);
//   req.body.password = hashedPassword;

//   const newUser = new userModel(req.body);

//   const businessFields = Object.keys(businessModel.schema.paths);

//   if (businessFields.some((field) => req.body[field])) {
//     // Only create the Business and associate it with the User if any business-related data is provided
//     const newBusiness = new businessModel(req.body);

//     newBusiness.user = newUser._id;

//     newUser.businesses.push(newBusiness._id);

//     const orderFields = Object.keys(orderModel.schema.paths);

//     if (orderFields.some((field) => req.body[field])) {
//       // Create a new Order only if triggered with related field
//       const newOrder = new orderModel(req.body);

//       newOrder.user = newUser._id;
//       newOrder.business = newBusiness._id;

//       await newOrder.save();
//     }

//     await newBusiness.save();
//   }

//   await newUser.save();

//   res.status(200).send({ message: "User created successfully", success: true });
// });

exports.getUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({ success: true, user: user });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const newData = req.body;
  const user = await userModel.findByIdAndUpdate(userId, newData, {
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

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;

  const user = await userModel.findByIdAndDelete(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const business = await businessModel.deleteMany({ user: userId });

  // if (!business) {
  //   res.json({
  //     message: "Business associated with user not found",
  //     success: false,
  //   });
  // }

  const orders = await orderModel.deleteMany({ user: userId });
  // if (!orders) {
  //   res.json({
  //     message: "Orders associated with user not found",
  //     success: false,
  //   });
  // }

  res.status(200).json({
    message: "User Account deleted successfully",
    success: true,
    //   data: [user, business],
  });
});

// exports.createNewBusiness = catchAsyncError(async (req, res, next) => {
//   const userId = req.params.id;

//   const user = await userModel.findById(userId);

//   if (!userId) {
//     return next(new ErrorHandler("User id error", 404));
//   }

//   const newBusiness = new businessModel(req.body);

//   newBusiness.user = userId;

//   user.businesses.push(newBusiness._id);

//   const orderFields = Object.keys(Order.schema.paths);

//   if (orderFields.some((field) => req.body[field])) {
//     // Create a new Order only if triggered with related field
//     const newOrder = new orderModel(req.body);

//     newOrder.user = user._id;
//     newOrder.business = newBusiness._id;

//     await newOrder.save();
//   }

//   await user.save();
//   await newBusiness.save();

//   res.status(200).json({
//     message: "Business created successfully",
//     success: true,
//     data: newBusiness,
//   });
// });

exports.getAllUserBusiness = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const business = await businessModel.find({ user: userId }).populate("user");

  if (!business) {
    return next(new ErrorHandler("No Business found", 404));
  }

  res.status(200).json({ success: true, businesses: business });
});

exports.getAllBusiness = catchAsyncError(async (req, res, next) => {
  const businessCount = await businessModel.countDocuments();
  const apiFeature = new APIFeatures(
    businessModel
      .find()
      .populate("user")
      .populate("package")
      .sort({ createdAt: -1 }),
    req.query
  ).search("businessName");

  let businesses = await apiFeature.query;
  let filteredbusinessCount = businesses.length;
  if (req.query.resultPerPage && req.query.currentPage) {
    apiFeature.pagination();

    // console.log("filteredUserCount", filteredUserCount);
    businesses = await apiFeature.query.clone();
  }

  if (!businesses) {
    return next(new ErrorHandler("No businesses found", 404));
  }

  res.status(200).json({
    success: true,
    businesses: businesses,
    businessCount: businessCount,
    filteredbusinessCount: filteredbusinessCount,
  });
});

exports.deleteBusiness = catchAsyncError(async (req, res, next) => {
  const business = await businessModel.findById(req.params.id);
  // const business = await businessModel.deleteMany({ _id: req.params.id });

  if (!business) {
    return next(new ErrorHandler("Business not found", 404));
  }

  const userBusinessId = await userModel.updateOne(
    { _id: business.user },
    { $pull: { businesses: business._id } }
  );

  const orderBusinessId = await orderModel.deleteOne({
    business: business._id,
  });

  const businessDel = await businessModel.findByIdAndDelete(req.params.id);

  res.status(204).json({
    message: "Business Account deleted successfully",
    success: true,
    // business: business,
  });
});

exports.getBusiness = catchAsyncError(async (req, res, next) => {
  const businessId = req.params.id;
  const business = await businessModel
    .findById(businessId)
    .populate("user")
    .populate("package");

  if (!business) {
    return next(new ErrorHandler("Business not found", 404));
  }

  res.status(200).json({ success: true, business: business });
});

exports.updateBusiness = catchAsyncError(async (req, res, next) => {
  const businessId = req.params.id;
  const newData = req.body;
  const business = await businessModel.findByIdAndUpdate(businessId, newData, {
    new: true,
    runValidators: true,
  });

  if (!business) {
    return next(new ErrorHandler("Business not found", 404));
  }

  res.status(200).json({
    message: "Business settings updated successfully",
    success: true,
    business: business,
  });
});

// exports.deleteBusiness = catchAsyncError(async (req, res, next) => {
//   const businessId = req.params.bid;

//   const business = await businessModel.findByIdAndDelete(businessId);

//   if (!business) {
//     return next(new ErrorHandler("Business not found", 404));
//   }

//   res.status(204).json({
//     message: "Business Account deleted successfully",
//     success: true,
//     // data: business,
//   });
// });

//----------------------------------packages----------------------

exports.createNewPackage = catchAsyncError(async (req, res, next) => {
  const packageExists = await packageModel.findOne({
    packageName: req.body.packageName,
  });
  const data = req.body;

  if (packageExists) {
    return next(new ErrorHandler("Package with same name already exists", 409));
  }

  const package = await new packageModel(data);
  await package.save();
  res.status(201).json({
    message: "package created successfully",
    success: true,
    package: package,
  });
});

exports.getAllPackages = catchAsyncError(async (req, res, next) => {
  const packageCount = await packageModel.countDocuments();
  const apiFeature = new APIFeatures(
    packageModel.find().sort({ createdAt: -1 }),
    req.query
  ).search("packageName");

  let packagesDetails = await apiFeature.query;
  let filteredPackagesCount = packagesDetails.length;
  // if (req.query.resultPerPage && req.query.currentPage) {
  apiFeature.pagination();

  packagesDetails = await apiFeature.query.clone();
  // }

  if (!packagesDetails) {
    return next(new ErrorHandler("No packages found", 404));
  }

  res.status(200).json({
    success: true,
    packages: packagesDetails,
    packageCount: packageCount,
    filteredPackagesCount: filteredPackagesCount,
  });
});

exports.getPackage = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;
  const package = await packageModel.findById(packageId);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({ success: true, package: package });
});

exports.updatePackage = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;
  const updates = req.body;
  const package = await packageModel.findByIdAndUpdate(packageId, updates, {
    new: true,
    runValidators: true,
  });

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({
    message: "Package updated successfully",
    success: true,
    package: package,
  });
});

exports.deletePackage = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;

  const package = await packageModel.findByIdAndDelete(packageId);
  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  res.status(200).json({
    message: "Package deleted successfully",
    success: true,
  });
});

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orderCount = await orderModel.countDocuments();
  let query = {};
  if (req.query.orderId) {
    query = {
      orderId: {
        $regex: req.query.orderId,
        $options: "i",
      },
    };
  }

  if (req.query.paymentStatus !== "all")
    query.paymentStatus = req.query.paymentStatus;

  const apiFeature = new APIFeatures(
    orderModel
      .find(query)
      .populate("user")
      .populate("business")
      // .populate("products.productName")
      .populate("products.package")
      .sort({ createdAt: -1 }),
    req.query
  );

  let orders = await apiFeature.query;
  let filteredOrderCount = orders.length;
  // if (req.query.resultPerPage && req.query.currentPage) {
  apiFeature.pagination();

  orders = await apiFeature.query.clone();
  // }

  if (!orders) {
    return next(new ErrorHandler("No Orders found", 404));
  }

  res.status(200).json({
    success: true,
    orders: orders,
    orderCount: orderCount,
    filteredOrderCount: filteredOrderCount,
  });
});

exports.getOrder = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await orderModel
    .findById(orderId)
    .populate("user")
    .populate("business")
    .populate("products.package");

  if (!order) {
    return next(new ErrorHandler("No Order found", 404));
  }

  res.status(200).json({ success: true, order: order });
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await orderModel.findByIdAndDelete(orderId);
  if (!order) {
    return next(new ErrorHandler("No Orders found", 404));
  }

  res
    .status(200)
    .json({ message: "Order deleted successfully", success: true });
});

//user and business corresponding orders

exports.getBusinessOrder = catchAsyncError(async (req, res, next) => {
  const businessId = req.params.bid;
  const orders = await orderModel.find({ business: businessId });

  if (orders.length === 0) {
    return next(new ErrorHandler("No Orders found", 404));
  }

  res.status(200).json({ success: true, orders: orders });
});

exports.getUserOrder = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  const orders = await orderModel.find({ user: userId });

  if (orders.length === 0) {
    return next(new ErrorHandler("No Orders found", 404));
  }

  res.status(200).json({ success: true, orders: orders });
});
