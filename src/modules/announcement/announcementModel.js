const { Schema, model } = require('mongoose');

const announcementSchema = new Schema({
    type: {
      type: String,
      enum: ['anuncio', 'evento', 'noticia'],
      requiered: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    image: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    status: {
      type: String,
      enum: ['pendiente', 'aprobado', 'rechazado'],
      default: 'pendiente',
      required: true
    }
});

module.exports = model('announcement', announcementSchema);