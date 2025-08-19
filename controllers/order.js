const asyncHandler = require('../middleware/async')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const ErrorResponse = require('../utils/errorResponse')
const mongoose = require('mongoose')
const Order = require('../models/Order')

// @desc    Get All Orders
// @route   Get /api/v1/orders
// @acsess  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  let my_query = {}
  if (req.user.role !== 'admin') {
    my_query.user = req.user._id.toString()
  }
  // TODO: remove to advanced querieng logic
  let { page = 1, limit = 100 } = req.query

  page = parseInt(page)
  limit = parseInt(limit)

  //   TODO: page and limit must be >0
  const skip = (page - 1) * limit // the n'th elements

  const orders = await Order.find(my_query)
    .sort({ ['createdAt']: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Order.countDocuments(my_query)
  const totalPages = Math.ceil(total / limit)

  const response = {
    success: true,
    page,
    limit,
    total,
    totalPages,
    data: orders,
  }

  res.status(200).json(response)
})

// @desc    Create Order
// @route   POST /api/v1/orders
// @acsess  Private
// @descreption
// Pulls data from user’s cart (fresh from DB, not client body).
// Calculates totals, validates stock, decrements stock, clears cart.
// Saves new order.
exports.createOrder = asyncHandler(async (req, res, next) => {
  // fetch order
  console.log('createOrder ran')

  // const mOrder = {
  //   user: req.user,
  //   cart_id: req.body.cartId,
  //   items: req.cart.items,
  // }

  // req.cart  already loaded from DB via middleware
  const order = await checkoutCart(req.user, req.cart)
  // TODO: hnadle shipping fee , for now no shipping fee

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order,
  })

  // TODO: add here email verifcation
  // TODO: add here email verifcation
})

// @desc    Get Order
// @route   Get /api/v1/Order/:orderId
// @acsess  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  console.log('getOrder() ran')
  res.status(200).json({ success: true, message: 'success', data: req.order })
})

// @desc    Update Order Status
// @route   PUT /api/v1/orders/:orderId/status
// @acsess  Private (Admin only)
// @description
// Admin-only route via isAdmin.
// Validates allowed statuses ('paid', 'shipped', 'delivered', 'cancelled').
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  // const check = req.order.canPerformAction('refund')
  // if (!check.allowed) {
  //   return next(new ErrorResponse(check.reason, 400))
  // }

  if (req.order.status === 'refunded') {
    return next(new ErrorResponse('Order refunded - Cant update Status ', 400))
  }
  req.order.status = req.body.status

  const updatedOrder = await req.order.save()

  res.status(200).json({
    success: true,
    data: updatedOrder,
  })

  // TODO: trigger notification/email/whatsapp
})

// @desc    Refund an order
// @route   POST /api/v1/orders/:id/refund
// @access  Admin
// controllers/orderController.js
exports.refundOrder = asyncHandler(async (req, res, next) => {
  const order = req.order

  // 1. Check if already refunded
  if (order.status === 'refunded') {
    return next(new ErrorResponse('Order already refunded', 400))
  }

  // 2. Allow refunds only if status is "paid" or "shipped"
  if (!['paid', 'shipped'].includes(order.status)) {
    return next(
      new ErrorResponse(
        `Order cannot be refunded while in status: ${order.status}`,
        400
      )
    )
  }
  // 2. Restore stock for each product
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    })
  }

  // 3. Update order status
  order.status = 'refunded'
  order.refundedAt = Date.now()

  await order.save()

  // 4. Respond
  res.status(200).json({
    success: true,
    message: 'Order refunded successfully',
    data: order,
  })

  // TODO: Trigger payment gateway refund
  // TODO: Send notification/email to customer
})

// @desc    Delete Product
// @route   DELETE /api/v1/products/:productId
// @acsess  Private (Admin only)
// TODO: pass it throght midlleware first to check if we have the product by id
// exports.deleteProduct = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params
//   const product = await Product.findById(productId)

//   await product.deleteOne()

//   res.status(200).json({ success: true, data: {} })
// })

async function checkoutCart(user, cart) {
  const { items, subtotal } = await Order.buildOrderFromCart(cart)
  const order = await Order.create({
    user,
    items,
    total: subtotal,
    subtotal: subtotal,
  })

  // Decrement stock for each product
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    })
  }

  // Clear the user's cart
  await cart.deleteOne()

  return order
}
