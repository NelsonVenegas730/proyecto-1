const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  token: { type: String, required: true },
  expires_at: { type: Date, required: true },
  used: { type: Boolean, default: false }
})

schema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('password_reset_tokens', schema)
