const { STATUS_NOT_FOUND } = require('./http-status');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

module.exports = NotFound;
