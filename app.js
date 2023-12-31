const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();
const getUsersRouter = require('./routes/users');

const getCardsRouter = require('./routes/cards');

const login = require('./controllers/user');
const createUser = require('./controllers/user');
const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', getUsersRouter);
app.use('/cards', getCardsRouter);
app.use('*', (req, res, next) => {
  next(res.status(HTTP_STATUS_NOT_FOUND).send({
    message: 'Некорректный адресс',
  }));
});
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
