const Coupon = require('../models/coupon.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');
const checkMongoObjectId = require('../server/checkMongoObjectId');

exports.createCoupon = async (req, res, next) => {
  try {
    const { describe, discount, remark, startDate, endDate, count } = req.body;
    let unUser = [];
    let usered = [];
    const newCoupon = await Coupon.create({
      describe,
      discount,
      remark,
      startDate,
      endDate,
      user: unUser,
      usered: usered,
      count,
    });
    successHandler(res, 'success', newCoupon);
  } catch (error) {
    return next(appError(401, err, next));
  }
};

// retrieve all posts from db
exports.findAllCoupon = async (req, res, next) => {
  try {
    const allCoupon = await Coupon.find({});
    if (!['', null, undefined].includes(allCoupon)) {
      successHandler(res, 'success', allCoupon);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.findPersonalCoupon = async (req, res, next) => {
  try {
    const { id } = req.body;
    const coupons = await Coupon.find({
      user: { $in: [id] },
    });
    const couponsEd = await Coupon.find({
      usered: { $in: [id] },
    });
    let targetED = couponsEd.map(function (item, index, array) {
      return item.id;
    });

    let couponsFilter = coupons.filter((item) => !targetED.includes(item.id));

    const currentDate = new Date();
    let target = couponsFilter.filter((item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      return (
        currentDate >= startDate && currentDate <= endDate && item.count > 0
      );
    });

    if (!['', null, undefined].includes(target)) {
      successHandler(res, 'success', target);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const { describe, discount, count, remark, startDate, endDate } = req.body;
    const data = { describe, discount, remark, startDate, endDate, count };
    if (!data.describe) {
      return next(appError(400, '描述不能為空', next));
    }
    if (!data.count) {
      return next(appError(400, '次數不能為空', next));
    }
    if (!data.discount) {
      return next(appError(400, '折扣價格不能為空', next));
    }
    if (!data.startDate) {
      return next(appError(400, '開始時間不能為空', next));
    }
    if (!data.endDate) {
      return next(appError(400, '結束時間不能為空', next));
    }
    const editCoupon = await Coupon.findByIdAndUpdate(CouponId, data);
    if (!editCoupon) {
      return next(appError(400, '查無此ID，無法更新', next));
    }
    const resultCoupon = await Coupon.findById(editCoupon).exec();
    successHandler(res, 'success', resultCoupon);
  } catch (err) {
    return next(appError(401, err, next));
  }
};

// delete a Coupon by id
exports.deleteOneCoupon = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const isCoupon = await Coupon.findById(CouponId).exec();
    if (!isCoupon) {
      return next(appError(400, '刪除失敗，無此ID', next));
    }
    await Coupon.findByIdAndDelete(CouponId);
    successHandler(res, '刪除成功');
  } catch (err) {
    return next(appError(401, err, next));
  }
};

// delete all Coupons
exports.deleteAllCoupon = async (req, res, next) => {
  try {
    await Coupon.deleteMany({});
    successHandler(res, '全部資料已刪除');
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.searchCoupon = async (req, res, next) => {
  try {
    const { searchText, page, pagination } = req.body;
    const searchCoupon = await Coupon.find({
      describe: { $regex: searchText },
    });
    let target = [];
    for (let i = (page - 1) * pagination; i < page * pagination; i++) {
      !searchCoupon[i] ? '' : target.push(searchCoupon[i]);
    }
    if (!['', null, undefined].includes(searchCoupon)) {
      successTotalHandler(res, 'success', target, searchCoupon.length);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.updateCouponUser = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const { user } = req.body;

    const targetCoupon = await Coupon.findById(CouponId);
    var targetCouponUser = targetCoupon?.user.filter(function (
      item,
      index,
      array
    ) {
      return item === user;
    });

    if (targetCouponUser.length == 0) {
      const editCouponCoupon = await Coupon.findByIdAndUpdate(
        CouponId,
        { $push: { user: user } },
        { new: true }
      );
      successHandler(res, 'success', editCouponCoupon);
    } else {
      return next(appError(400, '查無此ID，無法更新', next));
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};
