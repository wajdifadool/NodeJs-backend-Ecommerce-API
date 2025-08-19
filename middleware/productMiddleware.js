const ErrorResponse = require('../utils/errorResponse')

exports.checkAccess = (options) => {
  return (req, res, next) => {
    const { onlyAdmin } = options
    console.log(`checkAccess():: middleware checkAccess ran , {onlyadmin = ${onlyAdmin}}`)

    if (onlyAdmin) {
      if (!req.user) {
        return next(new ErrorResponse('Unauthorized access context missing', 500))
      } else if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Not authorized to access this Route', 403))
      }
    }

    return next()
  }
}
