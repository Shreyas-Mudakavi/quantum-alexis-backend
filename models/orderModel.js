const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
    products: [
      {
        productName: {
          type: Object,
          required: true,
        },
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    fulfillmentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Complete", "Client Action Required"],
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("Orders", orderSchema);

module.exports = orderModel;
