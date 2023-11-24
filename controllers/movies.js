const Movie = require('../models/movie');

// возвращает все сохранённые текущим пользователем фильмы
function getMovies(req, res) {
  return Movie.find()
    .orFail(new Error('err in getMovies - no movies'))
    .then((movies) => res.status(200).send(movies))
    .catch((err) => {
      console.error(err);
      return new Error('err in getMovies');
    });
}

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
// Уточнить trailerLink или trailer
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
    trailerLink: trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      console.error(err);
      return new Error('err in createMovie function');
    });
}
// return res.status(200).send({
//   country: movie.country,
//   director: movie.director,
//   duration: movie.duration,
//   year: movie.year,
//   description: movie.description,
//   image: movie.image,
//   trailer: movie.trailerLink, // переименовать???
//   nameRU: movie.nameRU,
//   nameEN: movie.nameEN,
//   thumbnail: movie.thumbnail,
//   movieId: movie.movieId,
//   owner: movie.owner,
//   _id: movie._id,
// });

// удаляет сохранённый фильм по id
function deleteMovie(req, res) {
  // есть ли фильм в бд и сравни owner до удаления
  Movie.findById(req.params._id)
    .orFail(new Error('err 1 in findById-deleteMovie - no such movie'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new Error('err 2 in findById-deleteMovie - wrong owner');
      }
      return res.status(200).send(movie);
    })
    .catch((err) => {
      console.error(err);
      return new Error('err 3 in deleteMovie - wrong owner');
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
