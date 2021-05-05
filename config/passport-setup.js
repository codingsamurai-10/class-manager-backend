const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/userModel');

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    userModel.findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
          console.log('old user found');
          done(null, user);
        }
        else {
          new userModel({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      })
  })
);