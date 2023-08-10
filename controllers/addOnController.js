const addOnProductsModel = require("../models/addOnModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

exports.createNewAddOnProduct = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const { name, productBelongsTo, description, amount } = req.body;

  console.log(data);

  const alreadyProduct = await addOnProductsModel.findOne({
    productBelongsTo: data.productBelongsTo,
  });

  if (alreadyProduct) {
    const addOnProducts = await addOnProductsModel.updateMany(
      { productBelongsTo: productBelongsTo },
      {
        $push: {
          productDetails: { name, description, amount },
        },
      }
    );

    return res.status(200).json({
      message: "addOn Products created successfully",
      success: true,
      addOnProducts: addOnProducts,
    });
  } else {
    const addOnProducts = await addOnProductsModel.create({
      productBelongsTo,
      productDetails: { name, description, amount },
    });
    await addOnProducts.save();

    return res.status(201).json({
      message: "addOn Products created successfully",
      success: true,
      addOnProducts: addOnProducts,
    });
  }
});

exports.getAllAddOnProducts = catchAsyncError(async (req, res, next) => {
  const addOnProductsCount = await addOnProductsModel.countDocuments();
  const apiFeature = new APIFeatures(
    addOnProductsModel.find().sort({ createdAt: -1 }),
    req.query
  ).search("productBelongsTo");

  let addOnProducts = await apiFeature.query;
  let filteredAddOnProductsCount = addOnProducts.length;
  // if (req.query.resultPerPage && req.query.currentPage) {
  apiFeature.pagination();

  addOnProducts = await apiFeature.query.clone();
  // }

  if (!addOnProducts) {
    return next(new ErrorHandler("No add on products found!", 404));
  }

  res.status(200).json({
    success: true,
    addOnProducts: addOnProducts,
    addOnProductsCount: addOnProductsCount,
    filteredAddOnProductsCount: filteredAddOnProductsCount,
  });
});

exports.getAddOnProducts = catchAsyncError(async (req, res, next) => {
  const addOnProduct = await addOnProductsModel.findOne({
    _id: req.params.id,
  });

  if (!addOnProduct) {
    // return next(new ErrorHandler("Product not found!", 404));

    const addOnInfo = await addOnProductsModel.findOne({
      "productDetails._id": req.params.id,
    });

    return res.status(200).json({
      success: true,
      addOnProduct: addOnInfo,
    });
  } else {
    // return next(new ErrorHandler("Product not found!", 404));
    return res.status(200).json({
      success: true,
      addOnProduct: addOnProduct,
    });
  }
});

exports.updateAddOnProducts = catchAsyncError(async (req, res, next) => {
  const { productBelongsTo, productDetails } = req.body;

  const addOnProduct = await addOnProductsModel
    .find({ productBelongsTo: productBelongsTo })
    .updateMany(
      //   { productDetails: productDetails },
      { $set: { productDetails: productDetails } }
    );

  //   console.log("add upda ", addOnProduct);

  res.status(200).json({
    success: true,
    addOnProduct: addOnProduct,
  });
});

exports.deleteAddOnProducts = catchAsyncError(async (req, res, next) => {
  const addOnProduct = await addOnProductsModel.findByIdAndDelete(
    req.params.id
  );

  res.status(200).json({
    success: true,
    msg: "Product deleted!",
  });
});

exports.getAddOnProductBelongsTo = catchAsyncError(async (req, res, next) => {
  const addOnProduct = await addOnProductsModel.findOne({
    productBelongsTo: req.query.category,
  });

  if (!addOnProduct) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  res.status(200).json({
    success: true,
    addOnProduct: addOnProduct,
  });
});
