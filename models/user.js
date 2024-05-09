const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле email должно быть заполнено'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный URL',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле password должно быть заполнено'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле name должно быть заполнено'],
      minlength: 2,
      maxlength: 30,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
