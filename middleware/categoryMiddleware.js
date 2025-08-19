const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Category = require('../models/Category')

exports.loadCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params
  const category = await Category.findById(categoryId)
  if (!category) {
    return next(new ErrorResponse(`Category ${categoryId} not found`, 404))
  }
  req.category = category
  return next()
})
