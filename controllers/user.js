const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданны некорректные данные' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректно введет id' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        avatar: req.body.avatar,
        about: req.body.about,
        email: req.body.email,
        password: hash,
      });
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданны некорректные данные' });
      } else if (err.code === 11000) {
        res
          .status(409)
          .send({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: `${req.body.name}`,
    about: `${req.body.about}`,
  }, { new: true, runValidators: true })
    .orFail()
    .then((updateUser) => res.send(updateUser))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь по указанному _id: ${req.params.userId} не найден.`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: `${req.body.avatar}` }, { new: true, runValidators: true })
    .orFail()
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: `Пользователь по указанному _id: ${req.params.userId} не найден.`,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
      // пользователь найден
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // аутентификация успешна
      const token = jwt.sign(
        { _id: req.user._id },
        'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
      return res.send({ token });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else if (err instanceof mongoose.Error.CastError) {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Некорректно введет id' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка' });
      }
    });
};
