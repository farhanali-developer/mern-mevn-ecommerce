const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AllProducts = require('../models/allproducts')
const Users = require('../models/users')
const {paginate} = require('../middleware/pagination')

// Get All AllProducts route
router.get('/', paginate(AllProducts), async (req, res) => {
  res.json(res.paginatedResult);
})



router.post('/login', async (req, res) => {
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

  const token = jwt.sign({ _id: user._id }, "secret")

  res.cookie('jwt', token, {
    httpOnly: true,
    //sameSite: 'none',
    //secure: true,
    maxAge: 24 * 60 * 60 * 1000 //1 day validity
  })

 res.send({
   message: "Success"
  })
  // res.json(token)
})

router.get('/user', async (req, res) => {
  try {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, "secret")

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
})

router.post('/logout', async (req, res) => {
  // res.cookie('jwt', '', {maxAge: 0})
  res.clearCookie('jwt')
    res.sendStatus(204)

  // res.send({
  //   message: "success"
  // })
})

router.post('/signup', async (req, res) => {

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const newUser = new Users({
    full_name: req.body.full_name,
    email: req.body.email,
    password: hashedPassword
  });

  const addUser = await newUser.save()
  const {password, ...data} = await addUser.toJSON();
  res.send(data)
})

// Add new Product
router.post('/add_product', async (req, res) => {
  
  const newProduct = new AllProducts(
    req.body // What the Vue App is sending
  ); 
  const saveProduct = await newProduct.save() // mongo save method
  res.json(saveProduct) // respond with json to our post endpoint
});

// Add new Product
router.post('/csv_products', async (req, res) => {
  
  const newProduct = await AllProducts.insertMany(req.body)
  // const saveProduct = await newProduct.save() // mongo save method
  res.json(newProduct) // respond with json to our post endpoint
});

// Getter by id
router.get('/get/:id', async (req, res) => {
  const t = await AllProducts.findById({ _id : req.params.id })
  res.json(t)
})

// Delete a Product by id
router.delete('/delete/:id', async (req, res) => {
  const deleteProduct = await AllProducts.findByIdAndDelete({ _id : req.params.id })
  res.json(deleteProduct)
})

router.delete('/deleteAll/', async (req, res) => {
  const deleteAllProducts = await AllProducts.deleteMany()
  res.json(deleteAllProducts)
})

// Update a Product by id
router.put('/update/:id', async (req, res) => {
  const updateProduct = await AllProducts.updateOne(
    { _id: req.params.id }, 
    { $set: req.body }
  )
  res.json(updateProduct)
})



module.exports = router