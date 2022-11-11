const User = require("../models/user.model");
const { successHandler } = require('../server/handle')
const appError = require("../server/appError")
const checkMongoObjectId = require('../server/checkMongoObjectId');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

// create and save a new post
exports.register = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userRepeat = await User.findOne({ account })
    if (userRepeat) {
      return next(appError(401, "帳號重複", next))
    }
    const token = jwt.sign({ account: account }, process.env.JWT_SECRET)

    const user = await User.create({
      account: account,
      password: bcryptjs.hashSync(password, 12),
      token: token,
    });

    successHandler(res, 'success', user);
  } catch (err) {
    return next(appError(401, err, next))
  }
};

exports.login = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const user = await User.findOne({ account }).select('+password');
    if (!['', null, undefined].includes(user)) {
      const correct = await bcryptjs.compare(password, user.password)
      if (!user || !correct) {
        return next(appError(401, "密碼錯誤", next))
      }
      successHandler(res, 'success', { user });
    } else {
      return next(appError(401, "無此帳號", next))
    }
  } catch (err) {
    return next(appError(401, err, next))
  }
};

exports.handPassWord = async (req, res, next) => {
  const { oldPassWord, newPassWord, newPassWordAgain, token } = req.body;
  const data = { oldPassWord, newPassWord, newPassWordAgain, token }

  const user = await User.findOne({ token }).select('+password');
  const oldPassWordCorrect = await bcryptjs.compare(data.oldPassWord, user.password)
  const newPassWordCorrect = await bcryptjs.compare(data.newPassWord, user.password)

  const updateNewPassWord = bcryptjs.hashSync(data.newPassWord, 12)

  if (!oldPassWordCorrect) {
    return next(appError(400, "舊密碼錯誤", next))
  }
  if (newPassWordCorrect) {
    return next(appError(400, "新舊密碼不能相同", next))
  }
  const editPassWord = await User.findByIdAndUpdate(user._id, { password: updateNewPassWord });
  successHandler(res, 'success', editPassWord)
};
