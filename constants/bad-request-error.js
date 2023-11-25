const { STATUS_BAD_REQUEST } = require('./http-status');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequest;
