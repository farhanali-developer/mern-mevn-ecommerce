const mongoose = require('mongoose')
const OrdersSchema = new mongoose.Schema(
    {
        deliveryMethod: String,
        paymentMethod: String,
        customerInfo : {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            first_name: String,
            last_name: String,
            phone: String,
            email: String,
            address: String
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                attributes: {
                    color: [],
                    size: []
                },
                quantity: Number,
                price: Number,
                subTotal: Number
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

module.exports = mongoose.model('Orders', OrdersSchema)