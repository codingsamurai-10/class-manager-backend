const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');

const periodsScheduleRouter = require('./routes/periodsSchedule');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');

require('dotenv').config();
require('./db.js');

const app = express();
app.use(cors());

app.use(cookieParser());
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
    maxAge: 30 * 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

const passportSetup = require('./config/passport-setup');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/periodsSchedule', periodsScheduleRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

module.exports = app;
