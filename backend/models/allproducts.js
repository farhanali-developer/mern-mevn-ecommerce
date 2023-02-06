const mongoose = require('mongoose')
const AllProductsSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  brand: String,
  category: String,
  sale: String
},  { timestamps: true })

module.exports = mongoose.model('products', AllProductsSchema)