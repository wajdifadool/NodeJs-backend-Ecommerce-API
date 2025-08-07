const express = require('express')

const { protect } = require('../middleware/auth')
const { checkAccess } = require('../middleware/productMiddlwares')

const router = express.Router()
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product')

// create read update delete
router
  .route('/')
  .post(protect, checkAccess({ onlyAdmin: true }), createProduct)
  .get(getProducts)

router
  .route('/:productId')
  .get(getProduct)
  .put(protect, checkAccess({ onlyAdmin: true }), updateProduct)
  .delete(protect, checkAccess({ onlyAdmin: true }), deleteProduct)

module.exports = router
