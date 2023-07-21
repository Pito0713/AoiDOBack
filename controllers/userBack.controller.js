const UserBack = require('../models/userBack.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.userBackRegister = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userBackRepeat = await UserBack.findOne({ account });
    if (userBackRepeat) {
      return next(appError(401, '帳號重複', next));
    }

    const token = jwt.sign({ account: account }, process.env.JWT_SECRET);
    const hashedPassword = bcryptjs.hashSync(password, 12);
    const userBack = await UserBack.create({
      account: account,
      password: hashedPassword,
      token: token,
      permission: 'guest',
    });

    successHandler(res, 'success', userBack);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.userBackLogin = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userBack = await UserBack.findOne({ account }).select('+password');

    if (!['', null, undefined].includes(userBack)) {
      const correct = await bcryptjs.compare(password, userBack.password);
      if (!userBack || !correct) {
        return next(appError(400, '密碼錯誤', next));
      }
      successHandler(res, 'success', { userBack });
    } else {
      return next(appError(400, '無此帳號', next));
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.userBackhandPassWord = async (req, res, next) => {
  try {
    const { oldPassWord, newPassWord, newPassWordAgain, token } = req.body;
    const data = { oldPassWord, newPassWord, newPassWordAgain, token };

    const userBack = await UserBack.findOne({ token }).select('+password');
    const oldPassWordCorrect = await bcryptjs.compare(
      data.oldPassWord,
      userBack.password
    );
    const newPassWordCorrect = await bcryptjs.compare(
      data.newPassWord,
      userBack.password
    );

    const updateNewPassWord = bcryptjs.hashSync(data.newPassWord, 12);

    if (!oldPassWordCorrect) {
      return next(appError(400, '舊密碼錯誤', next));
    }
    if (newPassWordCorrect) {
      return next(appError(400, '新舊密碼不能相同', next));
    }
    if (newPassWord !== newPassWordAgain) {
      return next(appError(400, '新密碼重複輸入錯誤', next));
    }
    const editPassWord = await UserBack.findByIdAndUpdate(userBack._id, {
      password: updateNewPassWord,
    });
    successHandler(res, 'success', editPassWord);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.userBackInfo = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = await UserBack.find({ token });
    if (userId) {
      successHandler(res, 'success', userId);
    } else {
      return next(appError(400, '無此帳號', next));
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.findAllUserBack = async (req, res, next) => {
  try {
    const { id } = req.body;
    const allUserBack = await UserBack.find({});
    if (!['', null, undefined].includes(allUserBack)) {
      let target = allUserBack.filter((item) => {
        if (item.id !== id) {
          return {
            id: item.id,
            permission: item.permission,
            account: item.account,
          };
        }
      });
      successHandler(res, 'success', target);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.uploadUserPermission = async (req, res, next) => {
  try {
    const { id, permission } = req.body;
    const editUser = await UserBack.findByIdAndUpdate(id, {
      permission: permission,
    });

    successHandler(res, 'success', editUser);
  } catch (err) {
    return next(appError(401, err, next));
  }
};
