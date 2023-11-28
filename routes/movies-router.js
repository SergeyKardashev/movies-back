const moviesRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../validators/celebrate-validators');

// возвращает все сохранённые текущим пользователем фильмы
moviesRouter.get('/', getMovies);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId
moviesRouter.post('/', validateCreateMovie, createMovie);

// удаляет сохранённый фильм по id
moviesRouter.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = moviesRouter;
