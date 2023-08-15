const { successHandler, successTotalHandler } = require('../server/handle');
const Product = require('../models/product.model');
const appError = require('../server/appError');

exports.allProduct = async (req, res) => {
  try {
    const { searchText, category, page, pagination } = req.body;

    if (['', null, undefined].includes(req.body?.['category[]'])) {
      let target = [];
      const allProduct = await Product.find({
        describe: { $regex: searchText },
      });
      if (allProduct.length > 0) {
        for (let i = (page - 1) * pagination; i < page * pagination; i++) {
          !allProduct[i] ? '' : target.push(allProduct[i]);
        }

        if (!['', null, undefined].includes(allProduct)) {
          successTotalHandler(res, 'success', target, allProduct.length);
        }
      } else {
        return next(appError(404, 'Resource not found', next));
      }
    } else {
      const allProduct = await Product.find({
        describe: { $regex: searchText },
        category: req.body?.['category[]'],
      });
      if (allProduct.length > 0) {
        let target = [];
        for (let i = (page - 1) * pagination; i < page * pagination; i++) {
          !allProduct[i] ? '' : target.push(allProduct[i]);
        }
        if (!['', null, undefined].includes(allProduct)) {
          successTotalHandler(res, 'success', target, allProduct.length);
        }
      } else {
        return next(appError(404, 'Resource not found', next));
      }
    }
  } catch (error) {
    return next(appError(400, 'request failed', next));
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { describe, quantity, price, remark, token, imageUrl, category } =
      req.body;
    const newProduct = await Product.create({
      describe,
      price,
      quantity,
      remark,
      token,
      imageUrl,
      category,
    });
    successHandler(res, 'success', newProduct);
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.uploadProduct = async (req, res, next) => {
  try {
    const cargoId = req.body.id;
    const { describe, price, quantity, remark, token, imageUrl, category } =
      req.body;
    const data = {
      describe,
      price,
      remark,
      token,
      imageUrl,
      category,
      quantity,
    };
    if (!data.describe) {
      return next(appError(400, 'describe request failed', next));
    }
    if (!data.price) {
      return next(appError(400, 'price request failed', next));
    }
    if (!data.category) {
      return next(appError(400, 'category request failed', next));
    }
    if (!data.quantity) {
      return next(appError(400, 'quantity request failed', next));
    }

    const editCargo = await Product.findByIdAndUpdate(cargoId, data);
    if (!editCargo) {
      return next(appError(404, '_id resource not found', next));
    }
    const resultCargo = await Product.findById(editCargo).exec();
    successHandler(res, 'success', resultCargo);
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.deleteProductOne = async (req, res, next) => {
  try {
    const cargoId = req.params.id;
    const isCargo = await Product.findById(cargoId).exec();
    if (!isCargo) {
      return next(appError(404, '_id resource not found', next));
    }
    await Product.findByIdAndDelete(cargoId);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.deleteProductCategory = async (req, res, next) => {
  try {
    let target = req.body?.['category[]'];

    if (target?.length > 0 && Array.isArray(target)) {
      for (let i = 0; target.length > i; i++) {
        const isCargo = await Product.findById(target[i]).exec();
        await Product.findByIdAndDelete(isCargo);
      }
    } else {
      const isCargo = await Product.findById(target).exec();
      await Product.findByIdAndDelete(isCargo);
    }
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(404, '_id resource not found', next));
  }
};

exports.productDatabase = async (req, res) => {
  try {
    const { searchText, category, page, pagination, isSort } = req.body;

    if (
      ['', null, undefined].includes(req.body?.['category[]']) ||
      req.body?.['category[]'] === '全部'
    ) {
      let target = [];
      const allProduct = await Product.find({
        describe: { $regex: searchText },
      });
      if (allProduct.length > 0) {
        for (let i = (page - 1) * pagination; i < page * pagination; i++) {
          !allProduct[i] ? '' : target.push(allProduct[i]);
        }
        if (!['', null, undefined].includes(allProduct)) {
          const compareFn = (a, b) => {
            const priceA = parseInt(a.price);
            const priceB = parseInt(b.price);

            if (isSort === 'asc') {
              return priceA - priceB; // 升序排序
            } else {
              return priceB - priceA; // 降序排序
            }
          };

          target.sort(compareFn);
          successTotalHandler(res, 'success', target, allProduct.length);
        } else {
          return next(appError(404, 'Resource not found', next));
        }
      }
    } else {
      const allProduct = await Product.find({
        describe: { $regex: searchText },
        category: req.body?.['category[]'],
      });
      if (allProduct.length > 0) {
        let target = [];
        for (let i = (page - 1) * pagination; i < page * pagination; i++) {
          !allProduct[i] ? '' : target.push(allProduct[i]);
        }
        const compareFn = (a, b) => {
          const priceA = parseInt(a.price);
          const priceB = parseInt(b.price);

          if (isSort === 'asc') {
            return priceA - priceB; // 升序排序
          } else {
            return priceB - priceA; // 降序排序
          }
        };

        target.sort(compareFn);
        successTotalHandler(res, 'success', target, allProduct.length);
      } else {
        return next(appError(404, 'Resource not found', next));
      }
    }
  } catch (error) {
    return next(appError(400, 'request failed', next));
  }
};
