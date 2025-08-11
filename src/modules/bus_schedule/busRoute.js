const express = require('express');
const router = express.Router();
const busScheduleController = require('./busController');

router.get('/', busScheduleController.getAllBusSchedules);
router.post('/add', busScheduleController.addBusSchedule);
router.delete('/delete/:id', busScheduleController.deleteBusSchedule);
router.put('/edit/:id', busScheduleController.updateBusSchedule);

module.exports = router;