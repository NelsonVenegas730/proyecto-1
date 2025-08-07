const authService = require('./passwordResetTokenService')

async function enviarCorreoRecuperacion(req, res) {
  const { correo } = req.body
  if (!correo) return res.status(400).json({ error: 'No se envió el correo' })

  const success = await authService.generateResetToken(correo)
  if (!success) return res.status(400).json({ error: 'Correo no registrado' })

  res.json({ message: 'Se envió un correo para recuperar tu contraseña, revisa tu correo para continuar' })
}

async function renderFormularioReset(req, res) {
  const { token } = req.query
  const validToken = await authService.validateResetToken(token)

  if (!validToken) {
    return res.render('autenticacion/cambiar-password', {
      error: 'Token inválido o expirado',
      title: 'Modificar Contraseña',
      layout: 'layouts/layout-auth',
      token: null
    })
  }

  res.render('autenticacion/cambiar-password', {
    title: 'Modificar Contraseña',
    layout: 'layouts/layout-auth',
    token
  })
}

async function guardarNuevaPassword(req, res) {
  const { token, password } = req.body
  const success = await authService.resetPassword(token, password)

  if (!success) {
    return res.status(400).json({ error: 'Token inválido o expirado o ya usado' })
  }

  res.json({ message: 'Contraseña actualizada correctamente' })
}

module.exports = {
  enviarCorreoRecuperacion,
  renderFormularioReset,
  guardarNuevaPassword
}