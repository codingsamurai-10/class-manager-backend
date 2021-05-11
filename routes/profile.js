var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
  if (req.user) {
    next();
  }
  else {
    res.send(null);
  }
}

router.get('/', authCheck, (req, res, next) => {
  const userData = { username: req.user.username, admin: req.user.admin };
  const json = JSON.stringify(userData);
  res.send(json);
});

module.exports = router;
