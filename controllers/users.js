const bcrypt = require('bcrypt');
const User = require('../models/user');

// создаёт юзера с переданными в теле email, password и name
// // нет проверки на ответ базы. Незахэширован пароль. Нет отлова ошибок
// const register = (req, res) => {
//   User.create(req.body)
//     .then((userData) => {
//       const userWithoutPassword = userData.toObject();
//       delete userWithoutPassword.password;
//       return res.status(200).send(userWithoutPassword);
//     });
// };
// корявоеслово

const { SALT_ROUNDS = 10 } = process.env;

async function register(req, res) {
  const { email, name, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, name, password: hash });

    // кажется, тут нужно возвращать токен. При регистрации.

    return res.status(200).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    });
  } catch (error) {
    return new Error('error from resister');
  }
}

module.exports = {
  register,
};
