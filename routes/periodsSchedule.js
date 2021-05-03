const express = require('express');
const router = express.Router();
const { getPeriodsSchedule, getFreeSlotsForBooking } = require('../controllers/periodsSchedule');

/* GET home page. */
router.get('/', getPeriodsSchedule);
router.post('/free', getFreeSlotsForBooking);

module.exports = router;
