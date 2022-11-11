const mongoose = require('mongoose')
const cargoSchema = new mongoose.Schema(
    {
      describe: {
        type: String,
        required: [true, 'describe 未填寫']
      },
      singNumber:{
        type: String,
        required: [true, 'singNumber 未填寫']
      },
      remark: {
        type:String,
        default:""
      },
      startDate: {
        type: Date,
        required: [true, 'startDate 未填寫']
      },
      endDate: {
        type: Date,
        required: [true, 'endDate 未填寫']
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      token: {
        type:String,
        // default:""
      },
      searchText: {
        type:String,
      },
    },
    {
      versionKey: false,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
);


const Cargo = mongoose.model('Cargo', cargoSchema);

module.exports = Cargo;