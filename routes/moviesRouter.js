const moviesRouter = require('express').Router();
const Movie = require('../models/movie'); // model

// возвращает все сохранённые текущим пользователем фильмы
moviesRouter.get('/', (req, res) => {
  res.status(200).send({ message: 'get request to /movies' });
});

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId
const createMovie = (req, res) => {
  // нет проверки на ответ базы, нет отлова ошибок
  Movie.create(req.body)
    .then((movieData) => res.status(200).send(movieData));
};
moviesRouter.post('/', createMovie);

// удаляет сохранённый фильм по id
moviesRouter.delete('/_id', (req, res) => {
  res.status(200).send({ message: 'delete request /movies/_id' });
});

module.exports = moviesRouter;
