const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('http2').constants;
const mongoose = require('mongoose');
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
  const { name, avatar, about } = req.body;
  User.create({ name, avatar, about })
    .then((user) => res.send({ data: user }))
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

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: `${req.body.name}`,
    about: `${req.body.about}`,
  }, { new: true, runValidators: true })
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
