const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema(
  {
    productBelongsTo: {
      type: String,
      required: true,
      enum: [
        "EIN and Business Documents",
        "Formation process",
        "Online tools",
        "Operating agreement",
        "Worry-Free Compliance",
      ],
    },
    productDetails: [
      {
        name: { type: String, required: true },
        description: {
          type: String,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const addOnProductsModel = mongoose.model("addOn", addOnSchema);

module.exports = addOnProductsModel;
