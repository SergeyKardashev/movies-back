const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// возвращает все сохранённые текущим пользователем фильмы
moviesRouter.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId

// const createMovie = (req, res) => {
//   // нет проверки на ответ базы, нет отлова ошибок
//   Movie.create(req.body)
//     .then((movieData) => res.status(200).send(movieData));
// };
moviesRouter.post('/', createMovie);

// удаляет сохранённый фильм по id
moviesRouter.delete('/:_id', deleteMovie);

module.exports = moviesRouter;
