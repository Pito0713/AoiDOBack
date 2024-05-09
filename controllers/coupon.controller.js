const Coupon = require('../models/coupon.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');

// 新增優惠卷
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
    return next(appError(400, 'request failed', next));
  }
};

exports.findAllCoupon = async (req, res, next) => {
  try {
    const allCoupon = await Coupon.find({});
    if (!['', null, undefined].includes(allCoupon)) {
      successHandler(res, 'success', allCoupon);
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
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
    if (couponsFilter.length > 0) {
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
    } else {
      return next(appError(400, '_id request failed', next));
    }
  } catch (err) {
    return next(appError(404, 'Resource not found', next));
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const { describe, discount, count, remark, startDate, endDate } = req.body;
    const data = { describe, discount, remark, startDate, endDate, count };
    if (!data.describe) {
      return next(appError(400, 'describe request failed', next));
    }
    if (!data.count) {
      return next(appError(400, 'count request failed', next));
    }
    if (!data.discount) {
      return next(appError(400, 'discount request failed', next));
    }
    if (!data.startDate) {
      return next(appError(400, 'startDate request failed', next));
    }
    if (!data.endDate) {
      return next(appError(400, 'endDate request failed', next));
    }
    const editCoupon = await Coupon.findByIdAndUpdate(CouponId, data);
    if (!editCoupon) {
      return next(appError(404, '_id resource not found', next));
    }
    const resultCoupon = await Coupon.findById(editCoupon).exec();
    successHandler(res, 'success', resultCoupon);
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.deleteOneCoupon = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const isCoupon = await Coupon.findById(CouponId).exec();
    if (!isCoupon) {
      return next(appError(404, '_id resource not found', next));
    }
    await Coupon.findByIdAndDelete(CouponId);
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.deleteAllCoupon = async (req, res, next) => {
  try {
    await Coupon.deleteMany({});
    successHandler(res, 'success');
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.searchCoupon = async (req, res, next) => {
  try {
    const { searchText, page, pagination } = req.body;
    const searchCoupon = await Coupon.find({
      describe: { $regex: searchText },
    });
    if (searchCoupon.length > 0) {
      let target = [];
      for (let i = (page - 1) * pagination; i < page * pagination; i++) {
        !searchCoupon[i] ? '' : target.push(searchCoupon[i]);
      }
      if (!['', null, undefined].includes(searchCoupon)) {
        successTotalHandler(res, 'success', target, searchCoupon.length);
      }
    } else {
      return next(appError(400, '_id request failed', next));
    }
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};

exports.updateCouponUser = async (req, res, next) => {
  try {
    const CouponId = req.params.id;
    const { user } = req.body;

    const targetCoupon = await Coupon.findById(CouponId);
    console.log(targetCoupon)
    console.log(CouponId)
    if (targetCoupon) {
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
        return next(appError(404, 'Resource not found', next));
      }
    } else {
      return next(appError(404, '_id resource not found111', next));
    }
  } catch (err) {
    return next(appError(400, 'request failed', next));
  }
};
