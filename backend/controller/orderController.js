const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
const Cart = require('../models/cart')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const orderData = async (req, res) => {
    const newOrder = await Orders.create(req.body);
    const userId = req.body.customerInfo.userId;
    console.log(userId)
    const deleteCart = await Cart.findOneAndRemove({userId: userId})
    return res.status(201).send(deleteCart);
}

module.exports = { orderData }