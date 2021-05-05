const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res, next) => {
  console.log('here');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/profile');
});

module.exports = router;
