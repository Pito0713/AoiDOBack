const mongoose = require("mongoose");
const productFilterSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "category 未填寫"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const productFilter = mongoose.model("productFilter", productFilterSchema);

module.exports = productFilter;
