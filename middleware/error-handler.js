const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later"

  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${err.keyValue} field`
    customError.statusCode = 400
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({
    msg: customError.msg
  })
}

module.exports = errorHandlerMiddleware
