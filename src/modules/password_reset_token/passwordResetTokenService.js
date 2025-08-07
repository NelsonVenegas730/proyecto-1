const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userModel = require('../../modules/user/userModel')
const tokenModel = require('./passwordResetTokenModel')

async function generateResetToken(email) {
  const user = await userModel.findOne({ email: email })
  if (!user) return null

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 1000 * 60 * 15)

  await tokenModel.create({
    user_id: user._id,
    token,
    expires_at: expires,
    used: false
  })

  const resetUrl = `http://localhost:3000/auth/password-reset/reset-password?token=${token}`

  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  const info = await transporter.sendMail({
    from: 'Recuperación de contraseña <no-reply@tuapp.com>',
    to: email,
    subject: 'Restablecer contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Recuperación de contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Hacé clic en el botón de abajo para cambiarla:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Cambiar contraseña</a>
        </p>
        <p>Si no solicitaste este cambio, podés ignorar este mensaje.</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
        <p style="font-size: 12px; color: #666;">Pora su seguridad, este enlace expira en 15 minutos.</p>
        <p style="font-size: 12px; color: #666;">Gracias por confiar en nosotros.</p>
      </div>
    `
  })

  console.log('📬 Vista previa:', nodemailer.getTestMessageUrl(info))

  return true
}

async function validateResetToken(token) {
  const record = await tokenModel.findOne({ token, used: false })
  if (!record || record.expires_at < new Date()) return null
  return record
}

async function resetPassword(token, newPassword) {
  const record = await validateResetToken(token)
  if (!record) return false

  const hashed = await bcrypt.hash(newPassword, 10)

  await userModel.updateOne(
    { _id: record.user_id },
    { $set: { password: hashed } }
  )

  await tokenModel.updateOne(
    { _id: record._id },
    { $set: { used: true } }
  )

  return true
}

module.exports = {
  generateResetToken,
  validateResetToken,
  resetPassword
}