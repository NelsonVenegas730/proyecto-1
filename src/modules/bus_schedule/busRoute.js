const express = require('express');
const router = express.Router();
const busScheduleController = require('./busController');

router.get('/', busScheduleController.getAllBusSchedules);

module.exports = router;