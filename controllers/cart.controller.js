const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');
const checkMongoObjectId = require('../server/checkMongoObjectId');

// create and save a new post
exports.cartData = async (req, res, next) => {
  try {
    const { token, page, pagination } = req.body;
    const allCart = await Cart.find({ token });
    const allCargo = await Product.find({});
    const cartDataValue = [];

    let targetAllCart = [];
    for (let i = (page - 1) * pagination; i < page * pagination; i++) {
      allCart[i] ? targetAllCart.push(allCart[i]) : '';
    }

    if (targetAllCart.length > 0) {
      targetAllCart.forEach((e) => {
        let cargo = allCargo.filter((item) => item.id == e.id);

        let target = {
          category: cargo[0].category,
          describe: cargo[0].describe,
          imageUrl: cargo[0].imageUrl,
          price: cargo[0].price,
          remark: cargo[0].remark,
          token: cargo[0].token,
          _id: cargo[0]._id,
          count: e.count,
        };

        cartDataValue.push(target);
      });
    }

    if (!['', null, undefined].includes(cartDataValue)) {
      successHandler(res, 'success', cartDataValue);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.createCart = async (req, res, next) => {
  try {
    const { id, token, count } = req.body;

    const userToken = await Cart.find({});
    let b = userToken.filter((item) => item.id == id);
    let data = { id, token, count };

    if (b.length > 0) {
      data.count = Number(b[0].count) + Number(count);
      const editCargo = await Cart.findByIdAndUpdate(b[0], data);
      successHandler(res, 'success', editCargo);
    } else {
      const newCart = await Cart.create({
        id,
        token,
        count,
      });
      successHandler(res, 'success', newCart);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.uploadCart = async (req, res, next) => {
  try {
    const { id, token, count } = req.body;
    const userToken = await Cart.find({});
    let b = userToken.filter((item) => item.id == id);
    let data = { id, token, count };
    if (b.length > 0) {
      data.count = Number(b[0].count) + Number(count);
      const editCargo = await Cart.findByIdAndUpdate(b[0], data);
      successHandler(res, 'success', editCargo);
    } else {
      const newCart = await Cart.create({
        id,
        token,
        count,
      });
      successHandler(res, 'success', newCart);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.deleteCart = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userToken = await Cart.find({});
    let b = userToken.filter((item) => item.id == id);
    const isCargo = await Cart.findById(b[0]._id).exec();
    if (!isCargo) {
      return next(appError(400, '刪除失敗，無此ID', next));
    }
    await Cart.findByIdAndDelete(isCargo._id);
    successHandler(res, '刪除成功');
  } catch (err) {
    return next(appError(401, err, next));
  }
};
