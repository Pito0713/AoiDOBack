const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    describe: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: String,
    },
    remark: {
      type: String,
    },
    token: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
