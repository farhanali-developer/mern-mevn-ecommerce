const mongoose = require('mongoose')
const UsersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phone: String,
  email: String,
  address: String,
  password: String,
  role: String,
  isGuest: Boolean
},  { timestamps: true })

module.exports = mongoose.model('users', UsersSchema)