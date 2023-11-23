const usersRouter = require('express').Router();

// возвращает информацию о пользователе (email и имя)
usersRouter.get('/me', (req, res) => {
  res.status(200).send({ message: 'get to /users/me ' });
});

// обновляет информацию о пользователе (email и имя)
usersRouter.patch('/me', (req, res) => {
  res.status(200).send({ message: 'patch to /users/me' });
});

module.exports = usersRouter;
