const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  productName: {
    type: String,
  },
});
