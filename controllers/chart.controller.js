const Chart = require('../models/chart.model');
const Product = require('../models/product.model');
const { successHandler } = require('../server/handle');
const appError = require('../server/appError');
const checkMongoObjectId = require('../server/checkMongoObjectId');

// create and save a new post
exports.chartData = async (req, res, next) => {
  try {
    const { token, page, pagination } = req.body;
    const allChart = await Chart.find({ token });
    const allCargo = await Product.find({});
    const chartDataValue = [];

    let targetAllChart = [];
    for (let i = (page - 1) * pagination; i < page * pagination; i++) {
      allChart[i] ? targetAllChart.push(allChart[i]) : '';
    }

    if (targetAllChart.length > 0) {
      targetAllChart.forEach((e) => {
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

        chartDataValue.push(target);
      });
    }

    if (!['', null, undefined].includes(chartDataValue)) {
      successHandler(res, 'success', chartDataValue);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};

exports.createChart = async (req, res, next) => {
  const { id, token, count } = req.body;

  const userToken = await Chart.find({});
  let b = userToken.filter((item) => item.id == id);
  let data = { id, token, count };

  if (b.length > 0) {
    data.count = Number(b[0].count) + Number(count);
    const editCargo = await Chart.findByIdAndUpdate(b[0], data);
    successHandler(res, 'success', editCargo);
  } else {
    const newChart = await Chart.create({
      id,
      token,
      count,
    });
    successHandler(res, 'success', newChart);
  }
};

exports.uploadChart = async (req, res, next) => {
  const { id, token, count } = req.body;
  const userToken = await Chart.find({});
  let b = userToken.filter((item) => item.id == id);
  let data = { id, token, count };
  if (b.length > 0) {
    data.count = Number(b[0].count) + Number(count);
    const editCargo = await Chart.findByIdAndUpdate(b[0], data);
    successHandler(res, 'success', editCargo);
  } else {
    const newChart = await Chart.create({
      id,
      token,
      count,
    });
    successHandler(res, 'success', newChart);
  }
};

exports.deleteChart = async (req, res, next) => {
  const { id, token } = req.body;
  const userToken = await Chart.find({});
  let b = userToken.filter((item) => item.id == id);
  const isCargo = await Chart.findById(b[0]._id).exec();
  if (!isCargo) {
    return next(appError(400, '刪除失敗，無此ID', next));
  }
  await Chart.findByIdAndDelete(isCargo._id);
  successHandler(res, '刪除成功');
};
