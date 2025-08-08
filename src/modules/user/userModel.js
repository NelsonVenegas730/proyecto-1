const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, default: '' },
  name: { type: String, default: '' },
  last_names: { type: String, default: '' },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['ciudadano', 'emprendedor', 'administrador'], default: 'ciudadano' },
  avatar: { type: String, default: '' }
});

module.exports = mongoose.model('user', usuarioSchema);
