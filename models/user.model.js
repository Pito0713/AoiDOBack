const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    account: {
      type: String,
      required: [true, '帳號不能為空'],
    },
    password: {
      type: String,
      required: [true, '密碼不能為空'],
      minlength: 8,
      minlength: 20,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    token: {
      type: String,
    },
    uesrName: {
      type: String,
    },
    birth: {
      type: String || Date,
    },
    phone: {
      type: Number,
    },
    addres: {
      type: String,
    },
    mail: {
      type: String,
    },
    photo: {
      type: String,
    },
    city: {
      type: String,
    },
    town: {
      type: String,
    },
    coupon: {
      type: Array,
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
