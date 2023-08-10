const Package = require("../models/packageModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.getPackages = catchAsyncError(async (req, res, next) => {
  const packages = await Package.find({});
  if (!packages) {
    return next(new ErrorHandler("No packages found!", 404));
  }
  res.status(200).json({ success: true, packages: packages });
});
