const asyncHandler = require('../middleware/async')
const Product = require('../models/Product')
const ErrorResponse = require('../utils/errorResponse')
const mongoose = require('mongoose')
const Category = require('../models/Category')
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body)
  res.status(201).json({ success: true, data: product })
})

// @desc    Get All products Todo
// @route   Get /api/v1/products
// @acsess  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let { categoryId, page = 1, limit = 10 } = req.query
  let my_query = {}

  // if (categoryId)
  //   {
  //   const products = await Product.find({
  //     categoryId: categoryId,
  //   })

  //   return res.status(200).json({
  //     success: true,
  //     count: products.length,
  //     data: products,
  //   })
  // }

  page = parseInt(page)
  limit = parseInt(limit)

  // Add category to query if it exists
  if (categoryId) {
    my_query.categoryId = new mongoose.Types.ObjectId(`${categoryId}`)
  }

  //   TODO: page and limit must be >0
  const skip = (page - 1) * limit // the n'th elements

  const products = await Product.find(my_query)
    .sort({ ['createdAt']: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Product.countDocuments(my_query)
  const totalPages = Math.ceil(total / limit)

  const response = {
    success: true,
    page,
    limit,
    total,
    totalPages,
    data: products,
  }

  res.status(200).json(response)
})

// @desc    Get Product
// @route   Get /api/v1/products/:productId
// @acsess  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params

  const product = await Product.findById(productId)

  if (!product) {
    return next(new ErrorResponse(`Product ${productId} not found`, 404))
  }

  res.status(200).json({ success: true, data: product })
})

// @desc    Update Product
// @route   PUT /api/v1/products/:productId
// @acsess  Private (Admin only)
// TODO: pass it throght midlleware first to check if we have the product by id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params

  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: req.body },

    //   {new:true} : will return the new updated Model

    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({ success: true, data: product })
})

// @desc    Delete Product
// @route   DELETE /api/v1/products/:productId
// @acsess  Private (Admin only)
// TODO: pass it throght midlleware first to check if we have the product by id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params
  const product = await Product.findById(productId)

  await product.deleteOne()

  res.status(200).json({ success: true, data: {} })
})
