const asyncHandler = require('../middleware/async')
const Cart = require('../models/Cart')

// @desc    Create New Cart
// @route   POST /api/v1/carts
// @acsess  Private
exports.createCart = asyncHandler(async (req, res, next) => {
  const { userId } = req.user._id
  const { items } = req.body
  const existingCart = await Cart.findOne({ userId })

  if (existingCart) {
    return res.status(400).json({
      success: false,
      message: 'Cart already exists for this user.',
    })
  }
  const cart = new Cart({
    userId: userId,
    items: items,
    user: req.user,
  })

  const savedCart = await cart.save()

  res.status(201).json({ success: true, data: savedCart })
})

// @desc    Get Cart
// @route   GET /api/v1/carts/:cartId
// @acsess  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: 'success', data: req.cart })
})

// @desc    Update Cart
// @route   PUT /api/v1/carts/:cartId
// @acsess  Private
exports.updateCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params

  req.cart = await Cart.findByIdAndUpdate(
    cartId,
    { $set: req.body },

    //   {new:true} : will return the new updated Model

    {
      new: true,
      runValidators: true,
    }
  )

  res.status(200).json({ success: true, data: req.cart })
})

// @desc    Delete Cart
// @route   DELETE /api/v1/carts/:cartId
// @acsess  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  await req.cart.deleteOne()

  res.status(200).json({ success: true, message: 'Cart deleted successfully' })
})
