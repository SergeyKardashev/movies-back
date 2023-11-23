const appRouter = require('express').Router();
const moviesRouter = require('./moviesRouter');
const usersRouter = require('./usersRouter');
const wrongRequestsRouter = require('./wrong-requests-router');
const User = require('../models/user');

// лишний
appRouter.get('/', (req, res) => { res.status(200).send({ message: 'test passed' }); });

// создаёт юзера с переданными в теле email, password и name
const register = (req, res) => {
  // нет проверки на ответ базы. Незахэширован пароль. Нет отлова ошибок
  User.create(req.body)
    .then((userData) => {
      const userWithoutPassword = userData.toObject();
      delete userWithoutPassword.password;
      return res.status(200).send(userWithoutPassword);
    });
};
appRouter.post('/signup', register);

// проверяет переданные в теле почту и пароль и возвращает JWT
appRouter.post('/signin', (req, res) => {
  res.status(200).send({ message: 'post request to /signin ' });
});

appRouter.use('/users', usersRouter);
appRouter.use('/movies', moviesRouter);

appRouter.use('*', wrongRequestsRouter);

module.exports = appRouter;
