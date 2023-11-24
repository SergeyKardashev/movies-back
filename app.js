const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

// eslint-disable-next-line no-console
mongoose.connect(DB_URL).then(console.log('MongoDB is connected'));

const app = express();

app.use(express.json());

// ВРЕМЕННАЯ мидлвэра авторизации
app.use((req, res, next) => {
  // req.user = { _id: '65607231a7b577dd2bc473e0' }; // gnom
  req.user = { _id: '655e3e96ff2d766cf7aedf6a' }; // Zoia
  next();
});

app.use('/', appRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}, mongoose ${mongoose.version}`);
});
