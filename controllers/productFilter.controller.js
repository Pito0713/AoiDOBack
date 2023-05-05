const ProductFilter = require("../models/productFilter.model");
const { successHandler } = require("../server/handle");
const appError = require("../server/appError");
const checkMongoObjectId = require("../server/checkMongoObjectId");

// create and save a new post
exports.productFilter = async (req, res, next) => {
  try {
    const userToken = await ProductFilter.find({});
    if (!["", null, undefined].includes(userToken)) {
      successHandler(res, "success", userToken);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.createProductFilter = async (req, res, next) => {
  const { category, token } = req.body;
  const newPlatform = await ProductFilter.create({
    category,
    token,
  });
  successHandler(res, "success", newPlatform);
};

exports.deleteProductFilter = async (req, res, next) => {
  const { id } = req.body;
  const isCargo = await ProductFilter.findById(id).exec();
  if (!isCargo) {
    return next(appError(400, "刪除失敗，無此ID", next));
  }
  await ProductFilter.findByIdAndDelete(id);
  successHandler(res, "刪除成功");
};
