const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_CREATED,
  MONGO_DUPLICATE_ERROR,
  STATUS_NOT_FOUND,
} = require('../constants/http-status');
const UnauthorizedError = require('../constants/unauthorized-error');
const NotFoundError = require('../constants/not-found-error');
const ConflictError = require('../constants/conflict-error');
const BadRequestError = require('../constants/bad-request-error');

const { SALT_ROUNDS = 10, NODE_ENV, JWT_SECRET } = process.env;

// настройки чтобы update возвращал обновленные данные, а не данные до обновления
const opts = { runValidators: true, new: true };

// На странице «Регистрация» клик по кнопке «Зарегистрироваться»
// отправляет запрос на роут / signup, если данные введены корректно.
// Если запрос прошёл успешно, то автоматически производится вход
// и редирект на страницу / movies.
async function register(req, res, next) {
  const { email, name, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, name, password: hashedPassword });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    // кажется, тут нужно возвращать токен. При регистрации.
    return res.status(STATUS_CREATED).send(userWithoutPassword);
    // return res.status(200).send({
    //   email: user.email,
    //   name: user.name,
    //   _id: user._id,
    // });
  } catch (err) {
    if (err.code === MONGO_DUPLICATE_ERROR) return next(new ConflictError('Этот email уже используется'));
    if (err.name === 'CastError' || err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    return next(err);
  }
}

// проверяет переданные в теле почту и пароль и возвращает JWT
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(new UnauthorizedError('Неверные почта или пароль'));

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new UnauthorizedError('Неверные почта или пароль');

    // можно вынести из login в утилиты функцию создания токена
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    return res.status(200).send({ token });
  } catch (err) {
    // console.error(err);
    return next(err);
  }
}

// возвращает инфо о пользователе (email и имя)
function getUser(req, res, next) {
  return User.findById(req.user._id)
    .orFail(new NotFoundError('_id не найден'))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        // Не ясно возвращать ли айдишник
        // наставник говорит можно
      });
    })
    .catch((err) => {
      if (err.statusCode === 404) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next(err);
    });
}

// обновляет информацию о пользователе (email и имя)
function updateUser(req, res, next) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .orFail(new NotFoundError())
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        // Не ясно возвращать ли айдишник
        // наставник говорит можно
      });
    })
    .catch((err) => {
      if (err.statusCode === STATUS_NOT_FOUND) return next(new NotFoundError('Пользователь по указанному _id не найден'));
      if (err.name === 'CastError') return next(new BadRequestError('Получение пользователя с некорректным id'));
      return next(err);
    });
}

module.exports = {
  register,
  login,
  getUser,
  updateUser,
};
