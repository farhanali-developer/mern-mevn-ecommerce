const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Cart = require('../models/cart')

const getCart = async (req, res) => {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, "secret")
    const cartData = await Cart.findOne({userId: decoded?._id}).populate("products.product")
    res.json(cartData)
}

const postCart = async (req, res) => {
    const { userId, product, quantity, price, subTotal, cartTotal } = req.body;
    const {totalQuantity, total } = cartTotal;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.product == product);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          productItem.subTotal = subTotal;
          cart.products[itemIndex] = productItem;
  
          let totalCart = cart.cartTotal;
          totalCart.totalQuantity = totalQuantity;
          totalCart.total = total;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ product, quantity, price, subTotal });
          let totalCart = cart.cartTotal;
          let totalQuantity = totalQuantity;
          let total = total;
          cart.cartTotal['totalQuantity'] = totalQuantity;
          cart.cartTotal['total'] = total;
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      }
      else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ product, quantity, price, subTotal }],
          cartTotal: {totalQuantity, total}
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
    const user_id = mongoose.Types.ObjectId(req.params.userId);
    const productToDelete = mongoose.Types.ObjectId(req.params.productId);
  
    // Query and pull out the task by its id
    const deleteProduct = await Cart.findOneAndUpdate(
      { userId: user_id },
      { $pull: { products: { product: productToDelete } } },
      {new:true}
    );
  
    if(deleteProduct?.products?.length == 0){
      await Cart.deleteOne({_id: deleteProduct?._id})
    }
  
    res.send(deleteProduct);
}

const deleteAll = async (req, res) => {
    const deleteAllProducts = await Cart.deleteMany()
    res.json(deleteAllProducts)
}

module.exports = { getCart, postCart, deleteCart, deleteAll }