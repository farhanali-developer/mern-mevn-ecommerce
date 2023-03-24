const express = require('express');
const router = express.Router();
const AllProducts = require('../models/allproducts')
const { paginate } = require('../middleware/pagination')
const { userLogin, userData, userLogout, userSignup, profileUpdate } = require('../controller/userController');
const { getAllProducts, addProduct, csvImport, getProductById, deleteById, deleteAllProducts, updateById } = require('../controller/productController');
const { getCart, postCart, postVirtualCart, deleteCart, deleteAll } = require('../controller/cartController');
const { getOrders, getOrderById, postOrderData, stripeKey, paymentIntent, getAllOrders, updateOrderStatus } = require('../controller/orderController')
const { getWishlist, addToWishlist, deleteWishlist } = require('../controller/wishlistController')
const { getCoupon, applyCoupon } = require('../controller/couponController')
const { getNotifications } = require('../controller/notificationsController')

// User routes
router.route('/user').get(userData).patch(profileUpdate)
router.route('/login').post(userLogin)
router.route('/logout').post(userLogout)
router.route('/signup').post(userSignup)

// All AllProducts routes
router.route('/').get(paginate(AllProducts), getAllProducts)
router.route('/add-product').post(addProduct)
router.route('/add-products-from-csv-file').post(csvImport)
router.route('/product/:id').get(getProductById)
router.route('/delete/:id').delete(deleteById)
router.route('/deleteAll').delete(deleteAllProducts)
router.route('/update/:id').put(updateById)

// Cart Routes
router.route('/cart').get(getCart).post(postCart).put(postCart)
router.route('/virtual-cart').post(postVirtualCart)
router.route('/delete-cart-item/:userId/:productId').delete(deleteCart)
router.route('/deleteAll').delete(deleteAll)

// Wishlist Routes
router.route('/wishlist').get(getWishlist).post(addToWishlist)
router.route('/delete-wishlist-item/:userId/:productId').delete(deleteWishlist)

//Order Routes
router.route('/create-payment-intent').post(paymentIntent)
router.route('/stripe-key').get(stripeKey)
router.route('/order').get(getOrders).post(postOrderData)
router.route('/order/:id').get(getOrderById)
router.route('/all-orders').get(getAllOrders)
router.route('/update-order').post(updateOrderStatus)

//Coupon Routes
router.route('/get-coupon-price').post(getCoupon)
router.route('/apply-coupon').post(applyCoupon)

//Notifications Routes
router.route('/notifications').get(getNotifications)

module.exports = router