const { status } = require('express/lib/response');
const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  sender_role: { type: String, enum: ['ciudadano', 'administrador'], required: true },
  message: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'user' },
  timestamp: { type: Date, required: true }
});

const supportTicketSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now, required: true },
  urgency_level: { type: String, default: '' },
  status: { type: String, enum: ['abierto', 'en proceso', 'cerrado'], default: 'abierto' },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  messages: { type: [messageSchema], default: [] }
});

module.exports = model('support_ticket', supportTicketSchema);