const mongoose = require('mongoose')
const platformSchema = new mongoose.Schema(
    {
      id: {
        type: String,
      },
      label: {
        type: String,
        required: [true, 'label 未填寫']
      },
      rate:{
        type: Number,
        required: [true, 'rate 未填寫']
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      token:{
        type: String
      },
    },
    {
      versionKey: false,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
);


const platform = mongoose.model('platform', platformSchema);

module.exports = platform;