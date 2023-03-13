const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
const Cart = require('../models/cart')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(STRIPE_SECRET_KEY)
const nodemailer = require("nodemailer");
const util = require('util')


const getOrders = async (req, res) => {
try {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, secret)
    const ordersData = await Orders.find({'customerInfo.userId': decoded?._id}).sort({ createdAt : "desc"}).populate("products.product")
    res.json(ordersData)
} catch (error) {
    console.log(error) 
}  
}

const stripeKey = async (req, res) => {
    res.json({stripeKey: STRIPE_PUBLISHABLE_KEY})
}

const getOrderById = async (req, res) => {
    const data = await Orders.findById({ _id : req.params.id })
    res.json(data)
}

const postOrderData = async (req, res) => {

    const newOrder = await Orders.create(req.body)
    const userId = req.body.customerInfo.userId
    const deleteCart = await Cart.findOneAndRemove({userId: userId})
    const newOrderId = newOrder?._id

    const deliveryMethod = newOrder?.deliveryMethod
    const paymentMethod = newOrder?.paymentMethod
    const firstName = newOrder?.customerInfo?.first_name
    const lastName = newOrder?.customerInfo?.last_name
    const phone = newOrder?.customerInfo?.phone
    const emailTo = newOrder?.customerInfo?.email
    const address = newOrder?.customerInfo?.address
    const totalQuantity = newOrder?.cartTotal?.totalQuantity
    const totalAmount = newOrder?.cartTotal?.total
    const date = new Date(newOrder?.createdAt);
    const orderDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);

    let productsHtml = '';

    const products = req.body?.products
    products.map((item) => {
        const title = item?.product?.title
        const qty = item?.quantity
        const price = item?.price
        const subTotal = item?.subTotal

        productsHtml = "Product Title: <b>"+ title +"</b><br>Quantity: <b>"+ qty +"</b><br>Price: <b>"+ price +"</b><br>Sub Total: <b>"+ subTotal +"</b><br>"
    })

     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "fareeboy12@gmail.com",
            pass: "mfjolmpsqjahecwx",
        },
    });

  
    // send mail with defined transport object
    await transporter.sendMail({
        from: 'fareeboy12@gmail.com', // sender address
        to: emailTo, // list of receivers
        subject: "Thank you! Your order is confirmed.", // Subject line
        // text: "Hello world?", // plain text body
        html: "<b>Your Order No. "+ newOrderId +" is confirmed.</b><br>Date: <b>"+ orderDate +"</b><br>Full Name: <b>"+ firstName + " " + lastName +"</b><br>Email: <b>"+ emailTo +"</b><br>Phone: <b>"+ phone +"</b><br>Address: <b>"+ address +"</b><br>"+ productsHtml +"<br>Total Quantity: <b>"+ totalQuantity +"</b><br>Total Amount: <b>$"+ totalAmount +"</b><br>Delivery Method: <b>"+ deliveryMethod +"</b><br>Payment Method: <b>"+ paymentMethod +"</b><br>",
    });

    res.status(201).json({orderId: newOrderId})
}

const paymentIntent = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
          currency: "USD",
          amount: 1999,
        //   automatic_payment_methods: { enabled: false },
          payment_method_types: [
            'card',
          ],
        });

        // const element = stripe.elements()
        // const client_secret = paymentIntent.client_secret
        // element.create()
    
        // Send publishable key and PaymentIntent details to client
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e) {
        return res.status(400).send({
          error: {
            message: e.message,
          },
        });
      }
}

module.exports = { getOrders, getOrderById, postOrderData, stripeKey, paymentIntent }