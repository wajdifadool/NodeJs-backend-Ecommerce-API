const asyncHandler = require('../middleware/async')
const Sample = require('../models/sample')

exports.getSample = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Sample endpoint working!' })
})

exports.setSample = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return next(new Error('Name is required'))
  }

  const sample = await Sample.create({ name })

  res.status(201).json({
    success: true,
    data: sample,
  })
})
