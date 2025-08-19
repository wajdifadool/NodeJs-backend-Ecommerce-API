// Dev Dependince
const colors = require('colors')
const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  console.log('-------------------------------------'.bgRed)
  console.log('errorHandler() called error : ')
  console.log(err)
  console.log('Error to string:\n'.rainbow)
  console.log(JSON.stringify(err, null, 2))
  console.log(JSON.stringify(req.body, null, 2)) // The 'null, 2' arguments format the output with indentation

  console.log('-------------------------------------'.bgRed)
  let error = { ...err }
  error.message = err.message

  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404)
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 409)
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
}

module.exports = errorHandler
