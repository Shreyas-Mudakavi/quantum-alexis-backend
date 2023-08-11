const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
    },
    tagLine: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    term: {
      type: String,
      required: true,
      enum: ["monthly", "yearly"],
    },
    included: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const packageModel = mongoose.model("Packages", packageSchema);

module.exports = packageModel;
