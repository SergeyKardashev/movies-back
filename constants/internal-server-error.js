const { STATUS_INTERNAL_SERVER_ERROR } = require('./http-status');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
