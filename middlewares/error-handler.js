const { STATUS_INTERNAL_SERVER_ERROR } = require('../constants/http-status');

function errorHandler(err, req, res, next) {
  console.log(err);
  const statusCode = err.statusCode || STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка по умолчанию' : err.message;

  res.status(statusCode).send({ message });
  next();
}

module.exports = errorHandler;
