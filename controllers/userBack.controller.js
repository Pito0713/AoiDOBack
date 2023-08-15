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
      return next(appError(400, 'account repeat', next));
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
    return next(appError(400, 'request failed', next));
  }
};

exports.userBackLogin = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    const userBack = await UserBack.findOne({ account }).select('+password');

    if (!['', null, undefined].includes(userBack)) {
      const correct = await bcryptjs.compare(password, userBack.password);
      if (!userBack || !correct) {
        return next(appError(400, 'password error', next));
      }
      successHandler(res, 'success', { userBack });
    } else {
      return next(appError(404, 'account is not exist', next));
    }
  } catch (err) {
    return next(appError(400, 'request failed', next));
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
      return next(appError(400, 'oldPassword failed', next));
    }
    if (newPassWordCorrect) {
      return next(
        appError(400, 'oldPassword and newPassword  are the same', next)
      );
    }
    if (newPassWord !== newPassWordAgain) {
      return next(appError(400, 'newPassword failed', next));
    }
    const editPassWord = await UserBack.findByIdAndUpdate(userBack._id, {
      password: updateNewPassWord,
    });
    successHandler(res, 'success', editPassWord);
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.userBackInfo = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = await UserBack.find({ token });
    if (userId) {
      successHandler(res, 'success', userId);
    } else {
      return next(appError(404, 'account is not exist', next));
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.findAllUserBack = async (req, res, next) => {
  try {
    const { id } = req.body;
    const allUserBack = await UserBack.find({});
    if (!['', null, undefined].includes(allUserBack)) {
      let target = allUserBack.filter((item) => {
        if (item._id.toString() !== id) {
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
    return next(appError(404, 'Resource not found', next));
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
    return next(appError(400, '_id request failed', next));
  }
};
