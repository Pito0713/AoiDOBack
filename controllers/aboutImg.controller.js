const AboutImg = require('../models/aboutImg.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');
const checkMongoObjectId = require('../server/checkMongoObjectId');

// create and save a new post
exports.createAboutImg = async (req, res, next) => {
  const { img, isActive } = req.body;
  const newAboutImg = await AboutImg.create({
    img,
    isActive,
  });
  successHandler(res, 'success', newAboutImg);
};

// retrieve all posts from db
exports.findAllAboutImg = async (req, res, next) => {
  try {
    const allAboutImg = await AboutImg.find({});
    if (!['', null, undefined].includes(allAboutImg)) {
      successHandler(res, 'success', allAboutImg);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.uploadAboutImg = async (req, res, next) => {
  try {
    const { id, isActive } = req.body;
    await AboutImg.updateOne({ _id: id }, { isActive: isActive });
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(401, err, next));
  }
};

// delete a Coupon by id
exports.deleteOneAboutImg = async (req, res, next) => {
  try {
    const AboutImgId = req.params.id;
    const isAboutImg = await AboutImg.findById(AboutImgId).exec();
    if (!isAboutImg) {
      return next(appError(400, '刪除失敗，無此ID', next));
    }
    await AboutImg.findByIdAndDelete(AboutImgId);
    successHandler(res, '刪除成功');
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.findActiveAboutImg = async (req, res, next) => {
  try {
    const searchCoupon = await AboutImg.find({
      isActive: true,
    });

    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', searchCoupon);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};
