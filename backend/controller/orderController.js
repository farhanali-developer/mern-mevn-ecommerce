const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Orders = require('../models/order')
const Cart = require('../models/cart')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET
const stripe_key = process.env.STRIPE_KEY
const stripe = require('stripe')(stripe_key)

const getOrders = async (req, res) => {
try {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, secret)
    const ordersData = await Orders.find({'customerInfo.userId': decoded?._id}).populate("products.product")
    res.json(ordersData)
} catch (error) {
    console.log(error) 
}  
}

const getOrderById = async (req, res) => {
    const data = await Orders.findById({ _id : req.params.id })
    res.json(data)
}

const postOrderData = async (req, res) => {
    // console.log(req.body)
    // products: [
    //     {
    //       attributes: [Object],
    //       product: [Object],
    //       quantity: 2,
    //       price: 20,
    //       subTotal: 40,
    //       _id: '64062a4da8aae8e7eea06cd2'
    //     }
    //   ],



    if(req.body.paymentMethod == "card"){

        const line_item = []
        // const productData = {
        //     price_data: {
        //         currency : "",
        //         product_data : {
        //             name: ""
        //         },
        //         unit_amount: ""
        //     },
        //     quantity: ''
        // }
        const email = req.body.customerInfo.email
        const products = req.body.products
        await products.map((product) => {
            return {
                price_data: {
                    currency : "usd",
                    product_data : {
                        name: product?.product?.title
                    },
                    unit_amount: product?.price
                },
                quantity: product?.quantity
            }
        })
    

        const session = await stripe.checkout.sessions.create({
            // line_items: [
            //   {
            //     price_data: {
            //       currency: 'usd',
            //       product_data: {
            //         name: 'T-shirt',
            //       },
            //       unit_amount: 2000,
            //     },
            //     quantity: 1,
            //   },
            // ],
            customer_email: email,
            line_items: req.body.products.map((product) => {
                return {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: product.product.title,
                      description: product.product.description, // add description field if available
                      images: [product.product.thumbnail], // add images array field if available
                    },
                    unit_amount: product.price * 100 // multiply price by 100 to convert to cents
                  },
                  quantity: product.quantity
                };
              }),
            mode: 'payment',
            success_url: 'http://localhost:4242/success',
            cancel_url: 'http://localhost:4242/cancel',
          });

        //   res.redirect(303, session.url);
        res.json({url: session.url})
    }
    else{
        const newOrder = await Orders.create(req.body)
        const userId = req.body.customerInfo.userId
        const deleteCart = await Cart.findOneAndRemove({userId: userId})
        const newOrderId = newOrder?._id
        res.status(201).json({orderId: newOrderId})
    }
}

module.exports = { getOrders, getOrderById, postOrderData }