const { Schema, model } = require('mongoose');

const businessSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  image: { type: String, default: '' }, // ruta o filename de la imagen
  user_id: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  date: { type: Date, required: true }
});

module.exports = model('business', businessSchema);