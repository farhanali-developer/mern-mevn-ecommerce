const mongoose = require('mongoose')
const AllProductsSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  price: Number,
  quantity: Number,
  brand: String,
  category: String,
  sold: Number,
  quantity: String,
  attributes: {
    color: [],
    size: []
  },
},  { timestamps: true })

module.exports = mongoose.model('products', AllProductsSchema)