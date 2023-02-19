const AllProducts = require('../models/allproducts')

const getAllProducts = async (req, res) => {
    res.json(res.paginatedResult);
}

const addProduct = async (req, res) => {  
    const newProduct = new AllProducts(
      req.body // What the Vue App is sending
    ); 
    const saveProduct = await newProduct.save() // mongo save method
    res.json(saveProduct) // respond with json to our post endpoint
}

const csvImport = async (req, res) => {
    const newProduct = await AllProducts.insertMany(req.body)
    res.json(newProduct) // respond with json to our post endpoint
}

const getProductById = async (req, res) => {
    const data = await AllProducts.findById({ _id : req.params.id })
    res.json(data)
}

const deleteById = async (req, res) => {
    const deleteProduct = await AllProducts.findByIdAndDelete({ _id : req.params.id })
    res.json(deleteProduct)
}

const deleteAllProducts = async (req, res) => {
    const deleteAllProducts = await AllProducts.deleteMany()
    res.json(deleteAllProducts)
}

const updateById = async (req, res) => {
    const updateProduct = await AllProducts.updateOne(
      { _id: req.params.id }, 
      { $set: req.body }
    )
    res.json(updateProduct)
}

module.exports = { getAllProducts, addProduct, csvImport, getProductById, deleteById, deleteAllProducts, updateById }