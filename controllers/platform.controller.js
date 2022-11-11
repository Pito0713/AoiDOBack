const Platform = require("../models/platform.model");
const { successHandler } =require('../server/handle')
const appError = require("../server/appError")
const checkMongoObjectId = require('../server/checkMongoObjectId');

// create and save a new post
exports.platformRate = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userToken = await Platform.find({ token:['1',token] })
    if (!['',null,undefined].includes(userToken)){
      successHandler(res, 'success', userToken);
    } 
  } catch (err) {
    return next(appError(401,err,next))
  }
};

exports.createModifyRate = async (req, res, next) => {
  const { label, rate, token } = req.body;
  const newPlatform = await Platform.create({
    label, rate, token
  });    
  successHandler(res, 'success', newPlatform);
};


exports.deleteModifyRate = async( req, res, next) => {
  const { id } = req.body;
  const isCargo = await Platform.findById(id).exec()
  if(!isCargo){
    return next(appError(400,"刪除失敗，無此ID",next))
  }
  await Platform.findByIdAndDelete(id)
  successHandler(res,"刪除成功")
};

