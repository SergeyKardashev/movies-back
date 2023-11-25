const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  console.log('вошел в auth');
  const { authorization } = req.headers;
  if (!authorization) {
    return new Error('Необходима авторизация');
  }

  if (authorization && !authorization.startsWith('Bearer')) {
    return new Error('Необходима авторизация');
  }

  const token = authorization.split('Bearer ')[1];

  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
  } catch (err) {
    console.error(err);
    return new Error('Необходима авторизация');
  }
  req.user = payload;
  return next();
}

module.exports = auth;
