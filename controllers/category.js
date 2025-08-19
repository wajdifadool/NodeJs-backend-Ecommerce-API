const asyncHandler = require('../middleware/async')
const Category = require('../models/Category')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Create New Category
// @route   POST /api/v1/category
// @acsess  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body

  const existingCategory = await Category.findOne({ name })
  if (existingCategory) {
    return next(new ErrorResponse(`Category ${name} already exists`, 409))
  }

  const category = await Category.create(req.body)
  //   console.log('creating category')
  res.status(201).json({ success: true, data: category })
})

// @desc    Get category
// @route   POST /api/v1/category/:categoryId
// @acsess  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.category })
})

// @desc    Get all categories
// @route   POST /api/v1/category
// @acsess  Public
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 })

  res.status(200).json({ success: true, count: categories.length, data: categories })
})

// @desc    Update category
// @route   PUT /api/v1/category/:categoryId
// @acsess  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  // Update only allowed fields (e.g., name and description)
  if (req.body.name) req.category.name = req.body.name
  if (req.body.description) req.category.description = req.body.description

  await req.category.save({ runValidators: true })

  res.status(200).json({ success: true, data: req.category })
})

// @desc    Delete category
// @route   DELETE /api/v1/category/:categoryId
// @acsess  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await req.category.deleteOne()
  res.status(200).json({ success: true, message: 'Category deleted' })
})
