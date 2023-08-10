const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    products: {
      productName: [
        {
          type: Object,
          required: true,
          // type: mongoose.Schema.Types.ObjectId,
          // ref: "addOn",
          // required: true,
        },
      ],
      package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Packages",
        required: true,
      },
    },

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
      default: "pending",
      required: true,
      enum: ["pending", "paid", "failed", "expired", "canceled"],
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
