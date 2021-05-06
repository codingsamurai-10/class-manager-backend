var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
  if (req.user) {
    next();
  }
  else {
    res.redirect('/auth/google');
  }
}

router.get('/', authCheck, (req, res, next) => {
  res.send(req.user);
  res.end();
});

module.exports = router;
