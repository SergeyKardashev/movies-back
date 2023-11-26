const Movie = require('../models/movie');
const { STATUS_CREATED } = require('../constants/http-status');
const NotFoundError = require('../constants/not-found-error');
const BadRequestError = require('../constants/bad-request-error');
const ForbiddenError = require('../constants/forbidden-error');

// возвращает все сохранённые текущим пользователем фильмы
function getMovies(req, res, next) {
  return Movie.find({ owner: req.user._id })
    .orFail(new Error('err in getMovies - no movies'))
    .then((movies) => res.send(movies))
    // можно сократить до .catch(next);
    .catch((err) => {
      console.error(err);
      return next();
    });
}

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
// Уточнить trailerLink или trailer
function createMovie(req, res, next) {
  const {
    country, director, duration, year,
    description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_CREATED).send({
      // нужно возвращать не все поля, из много.
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailerLink, // не как в запросе
      thumbnail: movie.thumbnail,
      owner: movie.owner,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      _id: movie._id, // добавил
    }))
    .catch((err) => {
      // console.error(err);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      return next(err);
    });
}

// удаляет сохранённый фильм по id
function deleteMovie(req, res, next) {
  // есть ли фильм в бд и сравни owner до удаления
  return Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильм с указанным _id не найден'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Попытка удалить чужой фильм'));
      }
      return Movie.findByIdAndDelete(req.params._id)
        .then((film) => res.send({ _id: film._id }));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.message === 'Not found') {
        return next(new NotFoundError('Фильм с указанным _id не найден'));
      }
      return next(err);
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
