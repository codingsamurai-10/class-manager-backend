const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id)
    .then(user => {
      done(null, user);
    });
})

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/api/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile.emails[0].value);
    userModel.findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
          done(null, user);
        }
        else {
          new userModel({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      })
  })
);