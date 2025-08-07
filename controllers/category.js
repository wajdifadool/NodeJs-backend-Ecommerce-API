const asyncHandler = require('../middleware/async')
const Category = require('../models/Category')
const Product = require('../models/Product')
const ErrorResponse = require('../utils/errorResponse')

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body)
  //   console.log('creating category')
  res.status(201).json({ success: true, data: category })
})

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params
  const category = await Category.findById(categoryId)
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: 'Category not found' })
  }

  res.status(200).json({ success: true, data: category })
})

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 })

  res
    .status(200)
    .json({ success: true, count: categories.length, data: categories })
})

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params

  const category = await Category.findById(categoryId)

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    })
  }

  // Update only allowed fields (e.g., name and description)
  if (req.body.name) category.name = req.body.name
  if (req.body.description) category.description = req.body.description

  const updatedCategory = await category.save() // Triggers slug regeneration

  res.status(200).json({ success: true, data: updatedCategory })
})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params

  const deletedCategory = await Category.findById(categoryId)

  if (!deletedCategory) {
    return res
      .status(404)
      .json({ success: false, message: 'Category not found' })
  }
  await deletedCategory.deleteOne()

  res
    .status(200)
    .json({ success: true, message: 'Category deleted successfully' })
})
