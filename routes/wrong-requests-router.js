const wrongRequestsRouter = require('express').Router();
// const NotFoundError = require('../errors/not-found-error');

wrongRequestsRouter.use('*', (req, res, next) => {
  // console.log('Requested URL:', req.url); // Для отладки. Не работает или плохо работает
  next(new Error('NotFoundError - Запрошенной страницы не существует'));
});

module.exports = wrongRequestsRouter;
