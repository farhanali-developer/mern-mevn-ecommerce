const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const orderData = async (req, res) => {
    console.log(req)
}

module.exports = { orderData }