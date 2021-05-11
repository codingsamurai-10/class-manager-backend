const express = require('express');
const router = express.Router();
const getNotifications = require('../controllers/notifications');

router.get('/', getNotifications);

module.exports = router;