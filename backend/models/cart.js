const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
    userId : String,
    orderData: [
        {
            productId: String,
            qty: Number,
            totalAmount: Number
        }
    ] 
},  { timestamps: true })

module.exports = mongoose.model('cart', CartSchema)