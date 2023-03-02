const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Users = require('../models/users')
require("dotenv").config({ path: "../.env" });
const secret = process.env.SECRET
const frontendUrl = process.env.FRONTEND_URL
const adminPanelURL = process.env.ADMINPANEL_URL

const userLogin = async (req, res) => {
  const origin = req.get('origin');

  const user = await Users.findOne({email: req.body.email})
  
  if(!user){
    return res.status(404).send({
      message: "User not found"
    })
  }

  const invalidCredetials = await bcrypt.compare(req.body.password, user.password)
  if(!invalidCredetials){
    return res.status(400).send({
      message: "Invalid Credentials!"
    })
  }

  if(origin == frontendUrl && user.role !== "user"){
    return res.status(400).send({
      message: "You are not a user."
    })
  }

  if(origin == adminPanelURL && user.role !== "admin"){
    return res.status(400).send({
      message: "You are not an admin."
    })
  }

  const token = jwt.sign({ _id: user._id}, secret)

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
    const cookie = req.cookies['jwt'];
    let claims;

    // Check if JWT token exists in cookies
    if(cookie){
      // If token exists, verify it
      claims = jwt.verify(cookie, secret);
    } 
    else {
      // If token doesn't exist, create a new guest user
      let guestUser = await Users.findOne({isGuest: true});

      if (!guestUser) {
        const newUser = new Users({isGuest: true});
        guestUser = await newUser.save();
      }
      
      claims = {_id: guestUser?._id};

      // Create a new JWT token with guest user's id
      const token = jwt.sign(claims, secret);

      // Set the JWT token as a cookie in the response
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //1 day validity
      });
    }

    // Fetch user data from MongoDB using the claims in the JWT token
    const user = await Users.findOne({_id: claims?._id})
    if(user){
      const { password, ...data } = await user.toJSON();
      res.send(data);
    }

    else{
      return res.status(404).send({
        message: "User not found."
      });
    }

  } catch (error) {
    return res.status(401).send({
      message: "Unauthenticated."
    });
  }
}

const userLogout = async (req, res) => {
    res.clearCookie('jwt')
    res.sendStatus(204)
    // res.status(204).send({
    //   message: "Logged out!"
    // })
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
    const checkUser = await Users.findById(req.body._id)
    if(!checkUser){
      res.status(404).send({message: "User not found."})
    }

    if(req.body.password){
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const updateUser = await Users.findByIdAndUpdate(
        req.body._id,
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
          password: hashedPassword,
          address: req.body.address,
          role: req.body.role
        },
        {
          new: true
        }
      )
      res.json(updateUser)
    }
    else{
      const updateUser = await Users.findByIdAndUpdate(
        req.body._id,
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address
        },
        {
          new: true
        }
      )
      res.json(updateUser)
    }

    
}

module.exports = { userLogin, userData, userLogout, userSignup, profileUpdate }