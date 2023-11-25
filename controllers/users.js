const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { SALT_ROUNDS = 10 } = process.env;
const opts = { runValidators: true, new: true };

// хитро удаляю пароль
// const register = (req, res) => {
//   User.create(req.body)
//     .then((userData) => {
//       const userWithoutPassword = userData.toObject();
//       delete userWithoutPassword.password;
//       return res.status(200).send(userWithoutPassword);
//     });
// };

// На странице «Регистрация» клик по кнопке «Зарегистрироваться»
// отправляет запрос на роут / signup, если данные введены корректно.
// Если запрос прошёл успешно, то автоматически производится вход
// и редирект на страницу / movies.
async function register(req, res) {
  const { email, name, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, name, password: hash });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    // кажется, тут нужно возвращать токен. При регистрации.
    return res.status(200).send(userWithoutPassword);
    // return res.status(200).send({
    //   email: user.email,
    //   name: user.name,
    //   _id: user._id,
    // });
  } catch (err) {
    console.error(err);
    return new Error('err in resister');
  }
}

// проверяет переданные в теле почту и пароль и возвращает JWT
// заглушка - не по правилам сделано
// токен создай колбэком.
// в matched ошибка через return или throw?

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password')
      .orFail(new Error('err in login orFail'));

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) { return new Error('err in login !matched'); }

    const token = jwt.sign({ _id: user._id }, 'dev-secret', { expiresIn: '7d' });
    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    return new Error('err in login');
  }
}

// возвращает инфо о пользователе (email и имя)
function getUser(req, res) {
  return User.findById(req.user._id)
    .orFail(new Error('err in getUser-findById-orFail'))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        // Не ясно возвращать ли айдишник
      });
    })
    .catch((err) => {
      console.error(err);
      return new Error('err in getUser');
    });
}

// обновляет информацию о пользователе (email и имя)
function updateUser(req, res) {
  return User.findByIdAndUpdate(req.user._id, req.body, opts)
    .orFail(new Error('err in findByIdAndUpdate'))
    .then((user) => {
      res.status(200).send({
        email: user.email,
        name: user.name,
        // Не ясно возвращать ли айдишник
      });
    })
    .catch((err) => {
      console.error(err);
      return new Error('err in updateUser');
    });
}

module.exports = {
  register,
  login,
  getUser,
  updateUser,
};
