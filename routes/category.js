const express = require('express')

const { protect } = require('../middleware/auth')
const { checkAccess } = require('../middleware/productMiddleware')
const { createCategory, getCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/category')
const { loadCategory } = require('../middleware/categoryMiddleware')

const router = express.Router()

router
  .route('/')
  .post(protect, checkAccess({ onlyAdmin: true }), createCategory)
  .get(getAllCategories)

router
  .route('/:categoryId')
  .get(loadCategory, getCategory)
  .put(protect, checkAccess({ onlyAdmin: true }), loadCategory, updateCategory)
  .delete(protect, checkAccess({ onlyAdmin: true }), loadCategory, deleteCategory)

module.exports = router
