const mongoose = require('mongoose')
const UsersSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  password: String,
  role: String
},  { timestamps: true })

module.exports = mongoose.model('users', UsersSchema)