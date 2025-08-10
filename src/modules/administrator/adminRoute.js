const express = require('express');
const router = express.Router();
const adminController = require('./adminController');

router.get('/gestion-contenido', adminController.getManagementContent);

module.exports = router;