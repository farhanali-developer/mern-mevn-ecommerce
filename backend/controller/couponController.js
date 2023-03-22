const mongoose = require('mongoose')
const Coupons = require('../models/coupons')
const Cart = require('../models/cart')
const Users = require('../models/users')

const getCoupon = async (req, res) => {
  try {
    const couponData = await Coupons.findOne({couponCode: req.body.data})
    res.json(couponData)
  } catch (error) {
      console.log(error) 
  }  
}

const applyCoupon = async (req, res) => {
  const userId = req?.body?.userId
  const couponPrice = req?.body?.couponPrice

  const checkUser = await Users.findById(userId)
  if(!checkUser){
    res.status(404).json({message: "User not found."})
  }
  
  let cart = await Cart.findOne({ userId });

  if (cart) {
    cart.cartTotal.couponPrice = couponPrice;
    cart.cartTotal.total = cart.cartTotal.total - couponPrice
    cart.save();
    res.status(200).send(true)
  }
  else{
    res.status(500).send(false);
  }

    
}

module.exports = { getCoupon, applyCoupon }