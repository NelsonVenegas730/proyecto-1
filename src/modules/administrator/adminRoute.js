const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/gestion-contenido', adminController.getManagementContent);
router.put('/gestion-contenido/estado', adminController.changeStatus);

module.exports = router;