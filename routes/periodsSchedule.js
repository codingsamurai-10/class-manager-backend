const express = require('express');
const router = express.Router();
const { getPeriodsSchedule } = require('../controllers/periodsSchedule');

/* GET home page. */
router.get('/', getPeriodsSchedule);

module.exports = router;
