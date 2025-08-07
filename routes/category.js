const express = require('express')

const { protect } = require('../middleware/auth')
const { checkAccess } = require('../middleware/productMiddlwares')

const router = express.Router()
const {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/category')

// create read update delete
router
  .route('/')
  .post(protect, checkAccess({ onlyAdmin: true }), createCategory)
  .get(getAllCategories)

router
  .route('/:categoryId')
  .get(getCategory)
  .put(protect, checkAccess({ onlyAdmin: true }), updateCategory)
  .delete(protect, checkAccess({ onlyAdmin: true }), deleteCategory)

module.exports = router
