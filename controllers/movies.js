const Movie = require('../models/movie');

// возвращает все сохранённые текущим пользователем фильмы
function getMovies(req, res) {
  return Movie.find()
    .then((movies) => res.status(200).send(movies))
    .catch(console.error);
}

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
function createMovie(req, res) {
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
    trailer,
    nameRU,
    nameEN,
    trailerLink: thumbnail,
    movieId, // зачем???
  })
    .then((movie) => res.status(200).send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailerLink, // переименовать???
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
      thumbnail: movie.thumbnail,
      movieId: movie._id, // переименовать!!!
      owner: movie.owner, // отдавать???
    }))
    .catch(console.error);
}

// удаляет сохранённый фильм по id
function deleteMovie(req, res) {
  // запрашиваю есть ли фильм в бд перед удалением
  return Movie.findByIdAndDelete(req.params._id)
    .then((movies) => res.status(200).send(movies))
    .catch(console.error);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
