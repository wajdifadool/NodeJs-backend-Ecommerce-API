const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async')
const Cart = require('../models/Cart')

exports.loadCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params

  const cart = await Cart.findById(cartId)

  if (!cart) {
    return next(new ErrorResponse(`Cart ${cartId} not found`, 404))
  }

  req.cart = cart
  return next()
})

// options = { allowOwner: true, allowCollaborator: true }
exports.checkAccess = () => {
  return (req, res, next) => {
    if (req.cart.user._id.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse('Not authorized to access this Cart', 403))
    }
    return next()
  }
}
