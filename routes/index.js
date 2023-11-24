const appRouter = require('express').Router();
const moviesRouter = require('./moviesRouter');
const usersRouter = require('./usersRouter');
const wrongRequestsRouter = require('./wrong-requests-router');
const { register, login } = require('../controllers/users');

// лишний
appRouter.get('/', (req, res) => { res.status(200).send({ message: 'test passed' }); });

// На странице «Регистрация» клик по кнопке «Зарегистрироваться»
// отправляет запрос на роут / signup, если данные введены корректно.
// Если запрос прошёл успешно, то автоматически производится вход
// и редирект на страницу / movies.
appRouter.post('/signup', register);

// проверяет переданные в теле почту и пароль и возвращает JWT
appRouter.post('/signin', login);

appRouter.use('/users', usersRouter);
appRouter.use('/movies', moviesRouter);

appRouter.use('*', wrongRequestsRouter);

module.exports = appRouter;
