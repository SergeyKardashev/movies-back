const appRouter = require('express').Router();
const moviesRouter = require('./movies-router');
const usersRouter = require('./users-router');
const wrongRequestsRouter = require('./wrong-requests-router');
const { register, login } = require('../controllers/users');
const { validateRegister, validateLogin } = require('../validators/celebrate-validators');
const auth = require('../middlewares/auth');

//  удалить краш-тестовый роут после ревью.
appRouter.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// На странице «Регистрация» клик по кнопке «Зарегистрироваться»
// отправляет запрос на роут / signup, если данные введены корректно.
// Если запрос прошёл успешно, то автоматически производится вход
// и редирект на страницу / movies.
appRouter.post('/signup', validateRegister, register);

// проверяет переданные в теле почту и пароль и возвращает JWT
appRouter.post('/signin', validateLogin, login);

// ВРЕМЕННАЯ мидлвэра авторизации
// appRouter.use((req, res, next) => {
//   // req.user = { _id: '65607231a7b577dd2bc473e0' }; // gnom
//   req.user = { _id: '655e3e96ff2d766cf7aedf6a' }; // Zoia
//   next();
// });

appRouter.use(auth);

appRouter.use('/users', usersRouter);
appRouter.use('/movies', moviesRouter);

appRouter.use('*', wrongRequestsRouter);

module.exports = appRouter;
