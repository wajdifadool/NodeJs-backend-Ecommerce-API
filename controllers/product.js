const asyncHandler = require('../middleware/async')
const Product = require('../models/Product')
const ErrorResponse = require('../utils/errorResponse')

exports.createProduct = asyncHandler(async (req, res, next) => {
  //   req.body.owner = req.user.id
  console.log('Hit /api/v1/product POST route')

  const product = await Product.create(req.body)
  res.status(201).json({ success: true, data: product })
})

// @desc    Get All products Todo
// @route   Get /api/v1/products
// @acsess  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  let { category, page = 1, limit = 10 } = req.query
  let my_query = {}

  page = parseInt(page)
  limit = parseInt(limit)

  // Add category to query if it exists
  if (category) {
    my_query.category = category
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
