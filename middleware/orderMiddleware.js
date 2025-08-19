const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Cart = require('../models/Cart')
const Order = require('../models/Order')

exports.loadCart = asyncHandler(async (req, res, next) => {
  const cartId = req.body.cartId

  const cart = await Cart.findById(cartId)

  if (!cart) {
    return next(new ErrorResponse(`Cart ${cartId} not found`, 404))
  }

  req.cart = cart
  // console.log(req.user)

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

/**
 * Fetches the order by ID from `req.params.id`, attaches it to `req.order`,
 * or throws a 404 error if the order is not found.
 */
exports.loadOrder = asyncHandler(async (req, res, next) => {
  console.log('middleware loadOrder ran')

  const order = await Order.findById(req.params.orderId)
  console.log('Order')
  console.log(order)

  if (!order) {
    return next(new ErrorResponse(`Order not found with id ${req.params.id}`, 404))
  }
  req.order = order
  return next()
})

/**
 * Allows admins to access any order.
 * Allows users to only access their own order.
 */
exports.checkOrderAccess = () => (req, res, next) => {
  console.log('middleware checkOrderAccess ran')
  if (req.user.role === 'admin') return next()
  if (req.order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized to access this order', 403))
  }
  next()
}

/**
 * Quick role guard for admin-only routes like status updates or refunds.
 */
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Admin only route', 403))
  }
  next()
}
