const asyncHandler = require('../middleware/async')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Create New Cart
// @route   POST /api/v1/carts
// @acsess  Private
exports.createCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id

  const { items } = req.body

  const existingCart = await Cart.findOne({ user: userId })

  if (existingCart) {
    return res.status(400).json({
      success: false,
      message: 'Cart already exists for this user.',
      cartId: existingCart.id,
    })
  }

  let orderItems = []

  // Validate Products and get profuct price from the data base
  for (const item of items) {
    const product = await Product.findById(item.productId)

    if (!product) {
      return next(new ErrorResponse(`Product Not found with the id of ${item.productId}`, 404))
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.title}`, 400))
    }

    // TODO: handle tax + shipping fee
    orderItems.push({
      productId: product._id,
      price: product.price,
      quantity: item.quantity,
    })
  }

  const cart = new Cart({
    userId: userId,
    items: orderItems,
    user: req.user,
  })

  const savedCart = await cart.save()

  res.status(201).json({ success: true, message: 'Cart Created', data: savedCart })
})

// @desc    Get Cart
// @route   GET /api/v1/carts/:cartId
// @acsess  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Cart Retrived', data: req.cart })
})

// @desc    Update Cart
// @route   PUT /api/v1/carts/:cartId
// @acsess  Private
exports.updateCart = asyncHandler(async (req, res, next) => {
  // Validate Products and get profuct price from the data base
  for (const item of req.body.items) {
    const product = await Product.findById(item.productId)

    if (!product) {
      return next(new ErrorResponse(`Product Not found with the id of ${item.productId}`, 404))
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.title}`, 400))
    }
  }

  req.cart.set(req.body)
  await req.cart.save({ runValidators: true })
  res.status(200).json({ success: true, message: 'Cart Updated', data: req.cart })
})

// @desc    Delete Cart
// @route   DELETE /api/v1/carts/:cartId
// @acsess  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  await req.cart.deleteOne()
  res.status(200).json({ success: true, message: 'Cart Deleted' })
})
