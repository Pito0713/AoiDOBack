const mongoose = require("mongoose");
const chartSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    token: {
      type: String,
    },
    count: {
      type: Number,
    },
    page: {
      type: Number,
    },
    pagination: {
      type: Number,
    },
  },
  {
    versionKey: false,
  }
);

const chart = mongoose.model("chart", chartSchema);

module.exports = chart;
