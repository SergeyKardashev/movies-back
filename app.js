const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const appRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./utils/limiter');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_URL).then(console.log('MongoDB is connected'));

const app = express();

// мидлвера для логирования URL. Нужна только для отладки
// app.use((req, res, next) => {
//   console.log('Requested URL:', req.url);
//   next();
// });

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(limiter); // Apply the rate limiting middleware to all requests.
app.use(requestLogger);

app.use('/', appRouter);

app.use(errorLogger);
app.use(errors()); // from celebrate error handler
app.use(errorHandler); // my global error handler and sorter for CAUGHT errors

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, mongoose ${mongoose.version}`);
});
