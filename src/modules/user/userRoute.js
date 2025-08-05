const express = require('express');
const router = express.Router();
const userController = require('./userController');

// POSTs (API lógica)
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/recover-password', userController.recoverPassword);

module.exports = router;
