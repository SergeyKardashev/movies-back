const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Movie = require('./models/movie');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

// eslint-disable-next-line no-console
mongoose.connect(DB_URL).then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({ message: 'root route test passed' });
});

const createUser = (req, res) => {
  // нет проверки на ответ базы. Незахэширован пароль. Нет отлова ошибок
  User.create(req.body)
    .then((userData) => {
      // работает удаление поля если привести к типу Объект
      const userWithoutPassword = userData.toObject();
      delete userWithoutPassword.password;
      return res.status(200).send(userWithoutPassword);
    });
};

const createMovie = (req, res) => {
  // нет проверки на ответ базы, нет отлова ошибок
  Movie.create(req.body)
    .then((movieData) => res.status(200).send(movieData));
};

app.post('/movies', createMovie); // временный неправильный роут
app.post('/posts', createUser);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}, mongoose ${mongoose.version}`);
});
