const authService = require('./passwordResetTokenService')

async function enviarCorreoRecuperacion(req, res) {
  const { correo } = req.body
  const success = await authService.generateResetToken(correo)
  if (!success) {
    return res.render('recover-password', { error: 'Correo no registrado' })
  }
  res.render('recover-password', { message: 'Revisá tu correo para continuar' })
}

async function renderFormularioReset(req, res) {
  const { token } = req.query
  const validToken = await authService.validateResetToken(token)
  if (!validToken) {
    return res.render('reset-password', { error: 'Token inválido o expirado' })
  }
  res.render('reset-password', { token })
}

async function guardarNuevaContrasena(req, res) {
  const { token, password } = req.body
  const success = await authService.resetPassword(token, password)
  if (!success) {
    return res.render('reset-password', { error: 'Token inválido o expirado' })
  }
  res.render('reset-password', { success: 'Contraseña actualizada correctamente' })
}

module.exports = {
  enviarCorreoRecuperacion,
  renderFormularioReset,
  guardarNuevaContrasena
}