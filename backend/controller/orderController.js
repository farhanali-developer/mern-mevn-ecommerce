const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
const Cart = require('../models/cart')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const getOrderById = async (req, res) => {
    const data = await Orders.findById({ _id : req.params.id })
    res.json(data)
}

const postOrderData = async (req, res) => {
    const newOrder = await Orders.create(req.body)
    const userId = req.body.customerInfo.userId
    const deleteCart = await Cart.findOneAndRemove({userId: userId})
    const newOrderId = newOrder?._id
    res.status(201).json({orderId: newOrderId})
}

module.exports = { getOrderById, postOrderData }