const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // guardás en uploads con nombre generado automático
const userController = require('./userController');

// Funciones de User de Administrador
router.get('/', userController.getAllUsersController);
router.post('/admin/add-user', userController.registerManualController);
router.delete('/admin/delete-user/:id', userController.deleteUser);

// Autenticación básica
router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Actualización de datos de usuario
router.put('/update-profile', userController.updateUserData);
router.put('/update-sensitive', userController.updateSensitive);
router.put('/update-avatar', upload.single('avatar'), userController.updateUserAvatar);
router.delete('/remove-avatar', userController.removeAvatar);

// Cambio de sesión rápido entre cuentas (roles) de un mismo usuario master
router.get('/accounts', userController.getAccounts);
router.post('/accounts/switch', userController.changeAccount);

module.exports = router;