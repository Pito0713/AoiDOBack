const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');

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
        let cargo = allCargo.filter((item) => item._id == e.id);

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

    successHandler(res, 'success', cartDataValue);

  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.uploadCart = async (req, res, next) => {
  try {
    const { id, token, count } = req.body;
    const CartList = await Cart.find({});
    if (CartList.length > 0) {
      let CartItem = CartList.filter((item) => item.id == id).filter(
        (item) => item.token == token
      );

      const productItem = await Product.findById(id).exec();
      const newCount = Number(productItem.quantity) - Number(count);
      if (newCount >= 0) {
        if (CartItem.length > 0) {
          await Product.updateOne(
            { _id: id },
            { $set: { quantity: newCount } }
          );
          let data = { id, token, count };
          data.count = Number(CartItem[0].count) + Number(count);
          const editCargo = await Cart.findByIdAndUpdate(CartItem[0], data);
          successHandler(res, 'success', editCargo);
        } else {
          const newCart = await Cart.create({
            id,
            token,
            count,
          });
          successHandler(res, 'success', newCart);
        }
      } else {
        return next(appError(404, 'stock not enough', next));
      }
    } else {
      return next(appError(404, 'Resource not found', next));
    }
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};


exports.deleteCart = async (req, res, next) => {
  try {
    const { id } = req.body;
    const userToken = await Cart.find({});
    if (userToken.length > 0) {
      let userTokenTagert = userToken.filter((item) => item.id == id);
      const isCargo = await Cart.findById(userTokenTagert[0]._id).exec();

      const productItem = await Product.findById(id).exec();
      if (!isCargo) {
        return next(appError(404, '_id resource not found', next));
      }
      const newCount =
        Number(productItem.quantity) + Number(userTokenTagert[0].count);

      await Product.updateOne({ _id: id }, { $set: { quantity: newCount } });
      await Cart.findByIdAndDelete(isCargo._id);
      successHandler(res, 'success');
    } else {
      return next(appError(404, 'Resource not found', next));
    }
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};
