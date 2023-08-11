const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();
const getUsersRouter = require('./routes/users');

const getCardsRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64cf741b12a85cd23112153a', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', getUsersRouter);
app.use('/cards', getCardsRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
