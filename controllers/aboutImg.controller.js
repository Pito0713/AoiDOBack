const AboutImg = require('../models/aboutImg.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.createAboutImg = async (req, res, next) => {
  try {
    const { img, isActive } = req.body;
    const newAboutImg = await AboutImg.create({
      img,
      isActive,
    });
    successHandler(res, 'success', newAboutImg);
  } catch (err) {
    return next(appError(400, 'request_failed', next));
  }
};

exports.findAllAboutImg = async (req, res, next) => {
  try {
    const allAboutImg = await AboutImg.find({});
    if (!['', null, undefined].includes(allAboutImg)) {
      successHandler(res, 'success', allAboutImg);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.uploadAboutImg = async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    await AboutImg.updateOne({ _id: id }, { isActive: isActive });
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, '_id request failed', next));
  }
};

exports.deleteOneAboutImg = async (req, res, next) => {
  try {
    const AboutImgId = req.params.id;
    const isAboutImg = await AboutImg.findById(AboutImgId).exec();
    if (!isAboutImg) {
      return next(appError(404, '_id resource not found', next));
    }
    await AboutImg.findByIdAndDelete(AboutImgId);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

// 取得關於圖片
exports.findActiveAboutImg = async (req, res, next) => {
  try {
    const searchCoupon = await AboutImg.find({
      isActive: true,
    });

    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', searchCoupon);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};
