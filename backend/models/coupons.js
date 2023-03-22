const mongoose = require('mongoose')
const CouponsSchema = new mongoose.Schema(
    {
      couponCode: String,
      couponPrice: Number,
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );

module.exports = mongoose.model('Coupons', CouponsSchema)