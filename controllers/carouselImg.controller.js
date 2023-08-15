const CarouselImg = require('../models/carouselImg.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.createCarouselImg = async (req, res, next) => {
  try {
    const { img, isActive } = req.body;
    const newCarouselImg = await CarouselImg.create({
      img,
      isActive,
    });
    successHandler(res, 'success', newCarouselImg);
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.findAllCarouselImg = async (req, res, next) => {
  try {
    const allCarouselImg = await CarouselImg.find();
    if (!['', null, undefined].includes(allCarouselImg)) {
      successHandler(res, 'success', allCarouselImg);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.uploadCarouselImg = async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    await CarouselImg.updateOne({ _id: id }, { isActive: isActive });
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, '_id request failed', next));
  }
};

exports.deleteOneCarouselImg = async (req, res, next) => {
  try {
    const CarouselImgId = req.params.id;
    const isCarouselImg = await CarouselImg.findById(CarouselImgId).exec();
    if (!isCarouselImg) {
      return next(appError(404, '_id resource not found', next));
    }
    await CarouselImg.findByIdAndDelete(CarouselImgId);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.findActiveCarouselImg = async (req, res, next) => {
  try {
    const searchCoupon = await CarouselImg.find({
      isActive: true,
    });

    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', searchCoupon);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};
