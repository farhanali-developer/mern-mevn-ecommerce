const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Wishlist = require('../models/wishlist')
const Users = require('../models/users')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const getWishlist = async (req, res) => {
  try {
    const userToken = req.cookies['jwt']
    const decoded = jwt.verify(userToken, secret)
    const wishlistData = await Wishlist.findOne({userId: decoded?._id}).populate("products.productId")
    // const wishlistData = await Wishlist.findOne({userId: decoded?._id})
    res.send(wishlistData)
  } catch (error) {
        console.log(error) 
  }
}

const addToWishlist = async (req, res) => {
    const userId = req.body.userId;
    const product = req.body.products;
    let wishlistProductId;
    product?.map((item) => {
        wishlistProductId = item?.productId;
    })
    const checkUser = await Wishlist.findOne({ userId: userId })

    // console.log(product)

    if (!checkUser) {
        const wishlistProducts = new Wishlist(req.body);
        const saveWishlist = await wishlistProducts.save();
        res.json(saveWishlist);
    } else {
        const updateWishlist = await Wishlist.findOneAndUpdate(
            { userId: userId },
            { $push: { products: { productId: wishlistProductId } }, $set: { modifiedOn: Date.now() } },
            { new: true }
        );
        res.json(updateWishlist);
    }
}

const deleteWishlist = async (req, res) => {
    // Define the user_id and product_id and prep them for the DB query
    const userId = mongoose.Types.ObjectId(req.params.userId);
    const productToDelete = mongoose.Types.ObjectId(req.params.productId);

    const deleteProductFromWishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { productId: productToDelete } } },
      { new: true }
    );
  
    if(deleteProductFromWishlist?.products?.length == 0){
      await Wishlist.deleteOne({_id: deleteProductFromWishlist?._id})
    }
  
    res.send(deleteProductFromWishlist);
}

module.exports = { getWishlist, addToWishlist, deleteWishlist }