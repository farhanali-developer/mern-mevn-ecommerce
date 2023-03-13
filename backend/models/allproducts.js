const mongoose = require('mongoose')
const AllProductsSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  price: Number,
  stock: Number,
  brand: String,
  category: String,
  sold: Number,
  attributes: Object,
  canBeSubscribed: Boolean
},  { timestamps: true })

module.exports = mongoose.model('products', AllProductsSchema)