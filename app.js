const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('dotenv').config();
require('./db.js');
require('./controllers/teleBot')

const passportSetup = require('./config/passport-setup');

const app = express();
const inProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    keys: [process.env.COOKIE_KEY],
    maxAge: 30 * 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

if(!inProduction) app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const periodsScheduleRouter = require('./routes/periodsSchedule');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const notifRouter = require('./routes/notif');
const changeWeekId = require('./scheduleWeekIdChange.js');

app.use('/api/periodsSchedule', periodsScheduleRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/Notifications', notifRouter)

if(inProduction) {
    app.use(express.static('build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

module.exports = app;
