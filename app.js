const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const periodsScheduleRouter = require('./routes/periodsSchedule');
const authRouter = require('./routes/auth');

const app = express();

require('dotenv').config();
require('./db.js');

const passportSetup = require('./config/passport-setup');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/periodsSchedule', periodsScheduleRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

module.exports = app;
