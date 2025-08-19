const express = require('express')

const { protect } = require('../middleware/auth')
const { loadCart, checkAccess, loadOrder, checkOrderAccess, isAdmin } = require('../middleware/orderMiddleware')
const { createOrder, getOrders, getOrder, updateOrderStatus, refundOrder } = require('../controllers/order')

const router = express.Router()

router.route('/').get(protect, getOrders)
router.route('/').post(protect, loadCart, checkAccess(), createOrder)

router.route('/:orderId').get(protect, loadOrder, checkOrderAccess(), getOrder)
router.route('/:orderId').put(protect, isAdmin, loadOrder, updateOrderStatus)
router.route('/:orderId/refund').put(
  protect,

  isAdmin,
  loadOrder,
  refundOrder
)

module.exports = router
