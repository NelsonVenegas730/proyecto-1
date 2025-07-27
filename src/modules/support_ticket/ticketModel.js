const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  sender_role: { type: String, enum: ['ciudadano', 'administrador'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

const supportTicketSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  urgency_level: { type: String, default: '' },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  messages: { type: [messageSchema], default: [] }
});

module.exports = model('support_ticket', supportTicketSchema);