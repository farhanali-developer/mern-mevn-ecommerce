const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/users')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET

const userLogin = async (req, res) => {
  const user = await Users.findOne({email: req.body.email})
  
  if(!user){
    return res.status(404).send({
      message: "User not found"
    })
  }

  const invalidCredetials = await bcrypt.compare(req.body.password, user.password)
  if(!invalidCredetials){
    return res.status(400).send({
      message: "Invalid Credentials"
    })
  }

  const token = jwt.sign({ _id: user._id, password: req.body.password }, secret)

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 //1 day validity
  }).json({
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    password: user.password,
    address: user.address,
    createdAt: user.createdAt,
    token
  })
}

const userData = async (req, res) => {
    try {
      const cookie = req.cookies['jwt']
  
      const claims = jwt.verify(cookie, secret)
  
      if(!claims){
        return res.status(401).send({
          message: "Unauthenticated."
        })
      }
  
      const user = await Users.findOne({_id: claims._id})
  
      // const {password, ...data} = await user.toJSON();
      const data = await user.toJSON();
  
      res.send(data)
    } catch (error) {
      return res.status(401).send({
        message: "Unauthenticated."
      })
    }
}

const userLogout = async (req, res) => {
    res.clearCookie('jwt')
    res.sendStatus(204)
}

const userSignup = async (req, res) => {
    const checkUser = await Users.findOne({email: req.body.email})
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new Users({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      address: req.body.address,
      role: req.body.role
    });
  
    if(!checkUser){
      const addUser = await newUser.save()
      const {password, ...data} = await addUser.toJSON();
      res.send(data)  
    }
    else{
      res.send("User Exists.");
    }
}

const profileUpdate = async (req, res) => {
    const checkUser = await Users.findOne({email: req.body.email})
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const newUser = new Users({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      address: req.body.address,
      role: req.body.role
    });
  
    if(!checkUser){
      const addUser = await newUser.save()
      const {password, ...data} = await addUser.toJSON();
      res.send(data)  
    }
    else{
      res.send("User Exists.");
    }
}

module.exports = { userLogin, userData, userLogout, userSignup, profileUpdate }