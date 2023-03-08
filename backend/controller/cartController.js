const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Cart = require('../models/cart')
const Users = require('../models/users')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const getCart = async (req, res) => {
  try {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, secret)
    const cartData = await Cart.findOne({userId: decoded?._id}).populate("products.product")
    res.json(cartData)
  } catch (error) {
      console.log(error) 
  }  
}

const postCart = async (req, res) => {
    // const { attributes } = req.body;

    const userId = req?.body?.userId
    const product = req?.body?.product
    const quantity = req?.body?.quantity
    const price = req?.body?.price
    const subTotal = req?.body?.subTotal
    const attributes = req?.body?.attributes

    console.log(req.body)
    
    const checkUser = await Users.findById(userId)
    if(!checkUser){
      res.status(404).json({message: "User not found."})
    }

    try {
      
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.product == product);

        let totalProducts = cart.products;
        let totalQuantity = '';
        let totalAmount = '';
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          productItem.subTotal = subTotal;

          if(attributes.color !== ""){
            productItem.attributes.color = attributes.color;
          }
          if(attributes.size !== ""){
            productItem.attributes.size = attributes.size;
          }

          cart.products[itemIndex] = productItem;

          totalProducts.map((products) => {
            totalQuantity = +totalQuantity + +products?.quantity;
            totalAmount = +totalAmount + +products?.subTotal;
          });

          cart.cartTotal['totalQuantity'] = totalQuantity;
          cart.cartTotal['total'] = totalAmount;

        } else {
          //product does not exists in cart, add new item
          cart.products.push({ product, quantity, price, subTotal, attributes });

          totalProducts.map((products) => {
            totalQuantity = +totalQuantity + +products?.quantity;
            totalAmount = +totalAmount + +products?.subTotal;
          });

          cart.cartTotal['totalQuantity'] = totalQuantity;
          cart.cartTotal['total'] = totalAmount;
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      }
      else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ product, quantity, price, subTotal, attributes }],
          cartTotal: { totalQuantity: quantity, total: subTotal }
        });
  
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
}

const deleteCart = async (req, res) => {
    // Define the user_id and product_id and prep them for the DB query
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const productToDelete = mongoose.Types.ObjectId(req.params.productId);

    const deleteProduct = await Cart.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { product: productToDelete } } },
      { new: true }
    );

    let cart = await Cart.findOne({ userId });
    let totalProducts = cart?.products;
    let totalQty = 0;
    let totalAmount = 0;

    await Promise.all(totalProducts.map(async (products) => {
      totalQty += products?.quantity;
      totalAmount += products?.subTotal;
    }));

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { cartTotal: { totalQuantity: totalQty, total: totalAmount } } },
      { new: true }
    );
  
    if(deleteProduct?.products?.length == 0){
      await Cart.deleteOne({_id: deleteProduct?._id})
    }
  
    res.send(updatedCart);
}

const deleteAll = async (req, res) => {
    const deleteAllProducts = await Cart.deleteMany()
    res.json(deleteAllProducts)
}

module.exports = { getCart, postCart, deleteCart, deleteAll }