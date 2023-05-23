const Country = require('../models/country.model');
const { successHandler, successTotalHandler } = require('../server/handle');
const appError = require('../server/appError');
const checkMongoObjectId = require('../server/checkMongoObjectId');

// retrieve all posts from db
exports.allCountry = async (req, res, next) => {
  try {
    const allCountry = await Country.find({});
    console.log(allCountry, 1454564654564654);
    if (!['', null, undefined].includes(allCountry)) {
      successHandler(res, 'success', allCountry[0]);
    }
  } catch (err) {
    return next(appError(401, err, next));
  }
};
