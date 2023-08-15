const MainImg = require('../models/mainImg.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.createMainImg = async (req, res, next) => {
  try {
    const { img, isActive } = req.body;
    const newMainImg = await MainImg.create({
      img,
      isActive,
    });
    successHandler(res, 'success', newMainImg);
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.findAllMainImg = async (req, res, next) => {
  try {
    const allMainImg = await MainImg.find({});
    if (!['', null, undefined].includes(allMainImg)) {
      successHandler(res, 'success', allMainImg);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.uploadMainImg = async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    await MainImg.updateOne({ _id: id }, { isActive: isActive });

    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, '_id request failed', next));
  }
};

// delete a Coupon by id
exports.deleteOneMainImg = async (req, res, next) => {
  try {
    const MainImgId = req.params.id;
    const isMainImg = await MainImg.findById(MainImgId).exec();
    if (!isMainImg) {
      return next(appError(400, '_id request failed', next));
    }
    await MainImg.findByIdAndDelete(MainImgId);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.findActiveMainImg = async (req, res, next) => {
  try {
    const searchCoupon = await MainImg.find({
      isActive: true,
    });

    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', searchCoupon);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};
