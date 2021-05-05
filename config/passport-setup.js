const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id)
    .then(user => {
      done(null, user.id);
    });
})

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    userModel.findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
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