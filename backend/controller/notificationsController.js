const jwt = require('jsonwebtoken')
const Notifications = require('../models/notifications')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const getNotifications = async (req, res) => {
    try {
        const userToken = req.cookies['jwt']
        const decoded = jwt.verify(userToken, secret)
        const notificationsData = await Notifications.find({'userId': decoded?._id}).sort({ createdAt : "desc"});
        console.log(notificationsData)
        res.json(notificationsData)
    } catch (error) {
        console.log(error) 
    }
}

module.exports = { getNotifications }