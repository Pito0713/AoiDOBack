const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema(
  {
    describe: {
      type: String,
      required: [true, 'describe 未填寫'],
    },
    discount: {
      type: String,
      required: [true, 'discount 未填寫'],
    },
    remark: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'startDate 未填寫'],
    },
    endDate: {
      type: Date,
      required: [true, 'endDate 未填寫'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    searchText: {
      type: String,
    },
    page: {
      type: Number,
    },
    pagination: {
      type: Number,
    },
    user: {
      type: Array,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
