const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class APIAccessError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE
  }
}

module.exports = APIAccessError;