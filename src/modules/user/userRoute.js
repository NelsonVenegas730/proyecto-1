const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // guardás en uploads con nombre generado automático
const userController = require('./userController');

router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.put('/update-profile', userController.updateUserData);
router.put('/update-sensitive', userController.updateSensitive);
router.put('/update-avatar', upload.single('avatar'), userController.updateUserAvatar);
router.delete('/remove-avatar', userController.removeAvatar);

module.exports = router;