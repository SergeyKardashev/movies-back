const usersRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validateUpdateUser } = require('../validators/celebrate-validators');

// возвращает информацию о пользователе (email и имя)
usersRouter.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
usersRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = usersRouter;
