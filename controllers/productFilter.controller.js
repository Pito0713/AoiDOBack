const ProductFilter = require('../models/productFilter.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.productFilter = async (req, res, next) => {
  try {
    const userToken = await ProductFilter.find({});
    if (!['', null, undefined].includes(userToken)) {
      successHandler(res, 'success', userToken);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.createProductFilter = async (req, res, next) => {
  try {
    const { category, token } = req.body;
    const newPlatform = await ProductFilter.create({
      category,
      token,
    });
    successHandler(res, 'success', newPlatform);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.deleteProductFilter = async (req, res, next) => {
  try {
    const { id } = req.body;
    const isCargo = await ProductFilter.findById(id).exec();
    if (!isCargo) {
      return next(appError(400, '刪除失敗，無此ID', next));
    }
    await ProductFilter.findByIdAndDelete(id);
    successHandler(res, '刪除成功');
  } catch (err) {
    return next(appError(401, err, next));
  }
};
