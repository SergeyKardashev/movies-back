const { STATUS_INTERNAL_SERVER_ERROR } = require('../constants/http-status');

function errorHandler(err, req, res, next) {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = statusCode === STATUS_INTERNAL_SERVER_ERROR ? 'Ошибка по умолчанию' : err.message;

  res.status(statusCode).send({ message });
  next();
}

module.exports = errorHandler;
