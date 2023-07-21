const Platform = require('../models/platform.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.platformRate = async (req, res, next) => {
  try {
    const userToken = await Platform.find({});
    if (!['', null, undefined].includes(userToken)) {
      successHandler(res, 'success', userToken);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.createModifyRate = async (req, res, next) => {
  try {
    const { label, rate, token } = req.body;
    const newPlatform = await Platform.create({
      label,
      rate,
      token,
    });
    successHandler(res, 'success', newPlatform);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.updateModifyRate = async (req, res, next) => {
  try {
    const { isActive, id } = req.body;
    await Platform.updateMany({ isActive: true }, { isActive: false });
    await Platform.findByIdAndUpdate(id, { isActive: true });

    successHandler(res, 'success');
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.deleteModifyRate = async (req, res, next) => {
  try {
    const { id } = req.body;
    const isCargo = await Platform.findById(id).exec();
    if (!isCargo) {
      return next(appError(400, '刪除失敗，無此ID', next));
    }
    await Platform.findByIdAndDelete(id);
    successHandler(res, '刪除成功');
  } catch (err) {
    return next(appError(401, err, next));
  }
};
