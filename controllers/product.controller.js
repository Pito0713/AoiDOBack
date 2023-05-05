const {
  successHandler,
  errorHandler,
  successTotalHandler,
} = require("../server/handle");
const Product = require("../models/product.model");
const appError = require("../server/appError");

exports.allProduct = async (req, res) => {
  try {
    const { searchText, token, category, page, pagination } = req.body;

    if (["", null, undefined].includes(req.body?.["category[]"])) {
      let target = [];
      const allProduct = await Product.find({
        describe: { $regex: searchText },
        token: token,
      });
      for (let i = (page - 1) * pagination; i < page * pagination; i++) {
        !allProduct[i] ? "" : target.push(allProduct[i]);
      }
      if (!["", null, undefined].includes(allProduct)) {
        successTotalHandler(res, "success", target, allProduct.length);
      }
    } else {
      const allProduct = await Product.find({
        describe: { $regex: searchText },
        token: token,
        category: req.body?.["category[]"],
      });
      let target = [];
      for (let i = (page - 1) * pagination; i < page * pagination; i++) {
        !allProduct[i] ? "" : target.push(allProduct[i]);
      }
      if (!["", null, undefined].includes(allProduct)) {
        successTotalHandler(res, "success", target, allProduct.length);
      }
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.addProduct = async (req, res) => {
  const { describe, price, remark, token, imageUrl, category } = req.body;
  const newProduct = await Product.create({
    describe,
    price,
    remark,
    token,
    imageUrl,
    category,
  });
  successHandler(res, "success", newProduct);
};

exports.uploadProduct = async (req, res, next) => {
  const cargoId = req.body.id;
  const { describe, price, remark, token, imageUrl, category } = req.body;
  const data = { describe, price, remark, token, imageUrl, category };
  if (!data.describe) {
    return next(appError(400, "內容不能為空", next));
  }
  if (!data.price) {
    return next(appError(400, "price 不能為空", next));
  }
  if (!data.category) {
    return next(appError(400, "category 不能為空", next));
  }

  const editCargo = await Product.findByIdAndUpdate(cargoId, data);
  if (!editCargo) {
    return next(appError(400, "查無此ID，無法更新", next));
  }
  const resultCargo = await Product.findById(editCargo).exec();
  successHandler(res, "success", resultCargo);
};

// delete a cargo by id
exports.deleteProductOne = async (req, res, next) => {
  const cargoId = req.params.id;
  const isCargo = await Product.findById(cargoId).exec();
  if (!isCargo) {
    return next(appError(400, "刪除失敗，無此ID", next));
  }
  await Product.findByIdAndDelete(cargoId);
  successHandler(res, "刪除成功");
};

// delete a cargo by id
exports.deleteProductCategory = async (req, res, next) => {
  let target = req.body?.["category[]"];

  if (target?.length > 0 && Array.isArray(target)) {
    for (let i = 0; target.length > i; i++) {
      const isCargo = await Product.findById(target[i]).exec();
      await Product.findByIdAndDelete(isCargo);
    }
  } else {
    const isCargo = await Product.findById(target).exec();
    await Product.findByIdAndDelete(isCargo);
  }
  successHandler(res, "刪除成功");
};

exports.productDatabase = async (req, res) => {
  try {
    const { searchText, token, category, page, pagination } = req.body;

    if (["", null, undefined].includes(req.body?.["category[]"])) {
      let target = [];
      const allProduct = await Product.find({
        describe: { $regex: searchText },
      });
      for (let i = (page - 1) * pagination; i < page * pagination; i++) {
        !allProduct[i] ? "" : target.push(allProduct[i]);
      }
      if (!["", null, undefined].includes(allProduct)) {
        successTotalHandler(res, "success", target, allProduct.length);
      }
    } else {
      const allProduct = await Product.find({
        describe: { $regex: searchText },
        category: req.body?.["category[]"],
      });
      let target = [];
      for (let i = (page - 1) * pagination; i < page * pagination; i++) {
        !allProduct[i] ? "" : target.push(allProduct[i]);
      }
      if (!["", null, undefined].includes(allProduct)) {
        successTotalHandler(res, "success", target, allProduct.length);
      }
    }
  } catch (error) {
    errorHandler(res, error);
  }
};
