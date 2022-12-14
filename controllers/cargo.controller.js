const Cargo = require("../models/cargo.model");
const { successHandler } =require('../server/handle')
const appError = require("../server/appError")
const checkMongoObjectId = require('../server/checkMongoObjectId');


// create and save a new post
exports.create = async (req, res,next) => {
    console.log()
    const { describe , singNumber, remark,startDate, endDate,token} = req.body;
    const newCargo = await Cargo.create({
      describe , singNumber, remark,startDate, endDate,token
    });    
    successHandler(res, 'success', newCargo);
};

// retrieve all posts from db
exports.findAll =  async(req, res , next) => {
  try {
    const { token } = req.body;
    const allCargo = await Cargo.find({ token })
    if (!['',null,undefined].includes(allCargo)){
      successHandler(res, 'success', allCargo);
    } 
  } catch (err) {
    return next(appError(401,err,next))
  }
};

// update a cargo by id
exports.updateCargo =  async(req, res, next) => {
  const cargoId = req.params.id
  const { describe , singNumber, remark,startDate, endDate} = req.body;
  const data ={ describe , singNumber, remark,startDate, endDate}
  if(!data.describe){
    return next(appError(400,"內容不能為空",next))
  }
  if(!data.singNumber){
    return next(appError(400,"singNumber 不能為空",next))
  }
  if(!data.startDate ){
    return next(appError(400,"startDate 不能為空",next))
  }
  if(!data.endDate){
    return next(appError(400,"endDate 不能為空",next))
  }
  const editCargo = await Cargo.findByIdAndUpdate(cargoId, data);
  if(!editCargo){
    return next(appError(400,"查無此ID，無法更新",next))
  }
  const resultCargo = await Cargo.findById(editCargo).exec()
  successHandler(res,'success',resultCargo)
};

// delete a cargo by id
exports.deleteOne = async( req, res, next) => {
  const cargoId = req.params.id
  const isCargo = await Cargo.findById(cargoId).exec()
  if(!isCargo){
    return next(appError(400,"刪除失敗，無此ID",next))
  }
  await Cargo.findByIdAndDelete(cargoId)
  successHandler(res,"刪除成功")
};

// delete all cargos
exports.deleteAll =  async(req, res, next) => {
  await Cargo.deleteMany({});
  successHandler(res,"全部資料已刪除")
};

exports.searchCargo = async(req, res, next) => { 
  try {
    const { searchText,token } = req.body;
    const searchCargo = await Cargo.find({singNumber: { $regex: searchText },token:token})
    if (!['',null,undefined].includes(searchCargo)){
      successHandler(res, 'success', searchCargo);
    } 
  } catch (err) {
    return next(appError(401,err,next))
  }
}



