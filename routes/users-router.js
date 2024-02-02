const usersRouter = require('express').Router();
const {
  getUser,
  updateUser,
  // updateUserError, // для отладки
} = require('../controllers/users');
const { validateUpdateUser } = require('../validators/celebrate-validators');

// возвращает информацию о пользователе (email и имя)
usersRouter.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
usersRouter.patch('/me', validateUpdateUser, updateUser);

// Тестовый роут возвращает ошибку. Нужен только для отладки
// Для его работы нужно импортировать updateUserError
// usersRouter.patch('/update-error', validateUpdateUser, updateUserError);

module.exports = usersRouter;
