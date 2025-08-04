const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, default: '' },
  name: { type: String, default: '' },
  last_names: { type: String, default: '' },
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['ciudadano', 'emprendedor', 'admin'], default: 'ciudadano' },
  status: { type: String, default: 'activo' }
});

module.exports = mongoose.model('User', usuarioSchema);
