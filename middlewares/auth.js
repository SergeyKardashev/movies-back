const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../constants/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  // console.log('вошел в auth');
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  if (authorization && !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.split('Bearer ')[1];
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    // console.error(err);
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
}

module.exports = auth;
