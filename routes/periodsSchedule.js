const express = require('express');
const router = express.Router();
const { getPeriodsSchedule, getFreeSlotsForBooking, bookSlot } = require('../controllers/periodsSchedule');

/* GET home page. */
router.get('/', getPeriodsSchedule);
router.post('/free', getFreeSlotsForBooking);
router.post('/book', bookSlot);

module.exports = router;
