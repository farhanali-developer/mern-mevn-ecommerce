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

    const userId = req?.body?.userId
    const product = req?.body?.product
    const quantity = req?.body?.quantity
    const price = req?.body?.price
    const salePrice = req?.body?.salePrice
    const subTotal = req?.body?.subTotal
    const attributes = req?.body?.attributes
    const canBeSubscribed = req?.body?.canBeSubscribed

    
    const checkUser = await Users.findById(userId)
    if(!checkUser){
      res.status(404).json({message: "User not found."})
    }
    
    let cart = await Cart.findOne({ userId });

    try {   
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(item => item.product == product);
        let totalProducts = cart.products;
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          productItem.subTotal = subTotal;
          productItem.canBeSubscribed = canBeSubscribed

          if(attributes.color !== ""){
            productItem.attributes.color = attributes.color;
          }
          if(attributes.size !== ""){
            productItem.attributes.size = attributes.size;
          }

          cart.products[itemIndex] = productItem;

          const totalQuantity = totalProducts.reduce((acc, current) => {
            return acc + parseInt(current?.quantity)
          }, 0)
          const totalAmount = totalProducts.reduce((acc, current) => {
            return acc + parseInt(current?.subTotal)
          }, 0)

          cart.cartTotal['totalQuantity'] = totalQuantity;
          cart.cartTotal['total'] = totalAmount;
          
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ product, quantity, price, subTotal, attributes, canBeSubscribed });

          const totalQuantity = totalProducts.reduce((acc, current) => {
            return acc + parseInt(current?.quantity)
          }, 0)
          const totalAmount = totalProducts.reduce((acc, current) => {
            return acc + parseInt(current?.subTotal)
          }, 0)
          
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
          products: [{ product, quantity, price, subTotal, attributes, canBeSubscribed }],
          cartTotal: { totalQuantity: quantity, total: subTotal, couponPrice: 0 }
        });
  
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }

}

const postVirtualCart = async (req, res) => {

  const userId = req?.body?.userId
  const product = req?.body?.product
  const quantity = req?.body?.quantity || 0
  const price = req?.body?.price
  const salePrice = req?.body?.salePrice
  const subTotal = req?.body?.subTotal
  const attributes = req?.body?.attributes
  const canBeSubscribed = req?.body?.canBeSubscribed
  const couponPrice = req?.body?.cartTotal?.couponPrice

  
  const checkUser = await Users.findById(userId)
  if(!checkUser){
    res.status(404).json({message: "User not found."})
  }
  
  let cart = await Cart.findOne({ userId });
  try {
        
    if (cart) {
      //cart exists for user
      let totalProducts = cart.products;

      //product does not exists in cart, add new item
      cart.products.push({ product, quantity, price, subTotal, attributes, canBeSubscribed });

      const totalQuantity = totalProducts.reduce((acc, current) => {
        return acc + parseInt(current?.quantity)
      }, 0)
      const totalAmount = totalProducts.reduce((acc, current) => {
        return acc + parseInt(current?.subTotal)
      }, 0)
      
      cart.cartTotal['totalQuantity'] = totalQuantity;
      cart.cartTotal['total'] = totalAmount;

      cart = await cart.save();
      return res.status(201).send(cart);
      
    }
    else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [{ product, quantity, price, subTotal, attributes, canBeSubscribed }],
        cartTotal: { totalQuantity: quantity, total: subTotal, couponPrice: couponPrice }
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

module.exports = { getCart, postCart, postVirtualCart, deleteCart, deleteAll }