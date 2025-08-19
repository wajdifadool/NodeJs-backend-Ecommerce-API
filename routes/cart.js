const express = require('express')

const { protect } = require('../middleware/auth')
const { loadCart, checkAccess } = require('../middleware/cartMiddleware')
const { createCart, getCart, updateCart, deleteCart } = require('../controllers/cart')

const router = express.Router()

router.route('/').post(protect, createCart)

router
  .route('/:cartId')
  .all(protect, loadCart, checkAccess()) // Runs for GET, PUT, DELETE
  .get(getCart)
  .put(updateCart)
  .delete(deleteCart)

module.exports = router
