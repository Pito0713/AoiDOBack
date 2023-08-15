const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');

exports.searchOrder = async (req, res, next) => {
  try {
    const { searchText, page, pagination } = req.body;
    const searchCoupon = await Order.find({
      'infoData.uesrName': { $regex: searchText },
    });
    let target = [];
    for (let i = (page - 1) * pagination; i < page * pagination; i++) {
      !searchCoupon[i] ? '' : target.push(searchCoupon[i]);
    }
    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', target, searchCoupon.length);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    let submitData = {
      id: '',
      token: {},
      CheckOutList: {},
      ProductList: [],
      selectedOption: {},
      infoData: {},
    };
    Object.entries(req.body).forEach(([key, value]) => {
      if (key.startsWith('CheckOutList')) {
        // 將 CheckOutList 項目轉換成物件
        const index = key.match(/\d+/)[0];
        const field = key.match(/\[([a-zA-Z]+)\]/)[1];
        submitData.CheckOutList[index] = submitData.CheckOutList[index] || {};
        submitData.CheckOutList[index][field] = value;
      } else if (key.startsWith('infoData')) {
        // 將 infoData 項目轉換成物件
        const field = key.match(/\[([a-zA-Z]+)\]/)[1];
        submitData.infoData[field] = value;
      } else {
        submitData[key] = value;
      }
    });

    for (let i = 0; i < Object.keys(submitData.CheckOutList).length; i++) {
      const document = await Product.findOne({
        _id: submitData.CheckOutList[i].id,
      });
      submitData.ProductList.push(document);
    }

    const checkQuantity = (submitData) => {
      const CheckOutList = submitData.CheckOutList;
      const ProductList = submitData.ProductList;

      for (const key in CheckOutList) {
        const checkoutItem = CheckOutList[key];
        const productId = checkoutItem.id;
        const count = parseInt(checkoutItem.count, 10);

        const productItem = ProductList.find(
          (item) => item._id.toString() === productId
        );
        if (productItem) {
          const quantity = parseInt(productItem.quantity, 10);
          if (quantity - count >= 0) {
            return true;
          } else return false;
        }
      }
    };
    const result = checkQuantity(submitData);

    if (result) {
      for (let i = 0; i < submitData.ProductList.length; i++) {
        const newCount =
          Number(submitData.ProductList[i].quantity) -
            Number(submitData.CheckOutList[i].count) <
          0
            ? 0
            : Number(submitData.ProductList[i].quantity) -
              Number(submitData.CheckOutList[i].count);

        await Product.updateOne(
          { _id: submitData.ProductList[i]._id },
          { $set: { quantity: newCount } }
        );
      }
    }

    let targetCoupon = {};

    if (submitData?.selectedOption) {
      targetCoupon = await Coupon.findById(submitData?.selectedOption);
      if (targetCoupon) {
        const userId = req.body.id;
        const index = targetCoupon.user.indexOf(userId);
        if (index !== -1) {
          targetCoupon.usered.push(userId);
          targetCoupon.count = Number(targetCoupon.count) - 1;
          await targetCoupon.save();
        }
      }
    }

    let token = submitData.token;
    let ProductList = submitData.ProductList;
    ProductList.map((item, index) => {
      if (item._id == submitData.CheckOutList[index].id) {
        return (item.quantity = submitData.CheckOutList[index].count);
      }
    });
    let selectedOption = submitData.selectedOption;
    let infoData = submitData.infoData;
    let totalPrice = ProductList.reduce((total, item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      return total + quantity * price;
    }, 0);
    if (totalPrice && targetCoupon) {
      totalPrice =
        totalPrice - Number(targetCoupon.discount) >= 0
          ? totalPrice - Number(targetCoupon.discount)
          : 0;
    }
    let totalQuantity = ProductList.length;

    const newCart = await Order.create({
      token,
      ProductList,
      selectedOption,
      infoData,
      totalPrice,
      totalQuantity,
    });

    successHandler(res, 'success', newCart);
    await Cart.deleteMany({ token });
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.deleteOneOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const isOrder = await Order.findById(orderId).exec();
    if (!isOrder) {
      return next(appError(404, '_id resource not found', next));
    }

    await Order.findByIdAndDelete(isOrder._id);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};
