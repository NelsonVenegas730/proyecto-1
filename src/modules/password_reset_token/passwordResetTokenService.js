const crypto = require('crypto')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userModel = require('../../modules/user/userModel')
const tokenModel = require('./passwordResetTokenModel')

async function generateResetToken(email) {
  const user = await userModel.findOne({ correo: email })
  if (!user) return null

  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 1000 * 60 * 15)

  await tokenModel.create({
    user_id: user._id,
    token,
    expires_at: expires,
    used: false
  })

  const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'TUCORREO@gmail.com',
      pass: 'TU_APP_PASSWORD'
    }
  })

  await transporter.sendMail({
    from: 'Recuperación de contraseña',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`
  })

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
    { $set: { contraseña: hashed } }
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