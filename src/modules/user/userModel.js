const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  master_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  username: { type: String, default: '' },
  name: { type: String, default: '' },
  last_names: { type: String, default: '' },
  email: { type: String },
  password: { type: String },
  role: { type: String, enum: ['ciudadano', 'emprendedor', 'administrador'], default: 'ciudadano' },
  avatar: { type: String, default: '' }
});

module.exports = mongoose.model('user', usuarioSchema);
