const SupportTicket = require('./ticketModel');

async function getAllTickets() {
  let tickets = await SupportTicket.find()
    .populate('user_id', 'name last_names email');

  tickets = await SupportTicket.populate(tickets, {
    path: 'messages.user_id',
    select: 'name last_names'
  });

  return tickets.map(ticket => ({
    ...ticket._doc,
    _id: ticket._id,
    date: ticket.date?.toISOString() || new Date().toISOString(),
    user_id: ticket.user_id || { name: 'Sin', last_names: 'Usuario' },
    messages: ticket.messages.map(msg => ({
      sender_role: msg.sender_role,
      message: msg.message,
      user_id: msg.user_id,
      timestamp: msg.timestamp ? msg.timestamp.toISOString() : new Date().toISOString(),
      sender_name: msg.sender_role === 'administrador'
        ? 'Administrador'
        : (msg.user_id?.name + ' ' + msg.user_id?.last_names || 'Usuario')
    }))
  }));
}

async function createTicket(data) {
  const ticket = new SupportTicket({
    title: data.title || '',
    description: data.description || '',
    date: new Date(),
    urgency_level: data.urgency_level || '',
    status: 'abierto',
    user_id: data.user_id,
    messages: []
  });

  return await ticket.save();
}

async function addMessage(ticketId, message) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new Error('Ticket not found');

  ticket.messages.push(message);
  await ticket.save();

  const populatedTicket = await SupportTicket.findById(ticketId)
    .populate('user_id', 'name last_names email')
    .populate('messages.user_id', 'name last_names');

    console.log(populatedTicket);

  return populatedTicket;
}

async function deleteTicket(ticketId) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new Error('Ticket no encontrado');

  await SupportTicket.findByIdAndDelete(ticketId);
  return { message: 'Ticket eliminado con éxito' };
}

module.exports = {
  getAllTickets,
  createTicket,
  addMessage,
  deleteTicket
};
