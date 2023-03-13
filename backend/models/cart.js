const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: Number,
          price: Number,
          subTotal: Number,
          canBeSubscribed: Boolean,
          attributes: {
            color: String,
            size: String
          },
        }
      ],
      cartTotal: {
        totalQuantity: Number,
        total: Number
      },
      modifiedOn: {
        type: Date,
        default: Date.now
      }
    },
    { timestamps: true }
  );

module.exports = mongoose.model('Cart', CartSchema)