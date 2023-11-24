const usersRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
usersRouter.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
usersRouter.patch('/me', updateUser);

module.exports = usersRouter;
