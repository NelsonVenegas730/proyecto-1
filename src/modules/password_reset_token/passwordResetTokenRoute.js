const express = require('express')
const router = express.Router()
const authController = require('./passwordResetTokenController')

router.post('/recover-password', authController.enviarCorreoRecuperacion)
router.get('/reset-password', authController.renderFormularioReset)
router.post('/reset-password', authController.guardarNuevaContrasena)

module.exports = router