const SupportTicket = require('./ticketModel');

async function getAllTickets() {
  const tickets = await SupportTicket.find().populate('user_id', 'name email');
  return tickets.map(ticket => ({
    ...ticket._doc,
    date: ticket.date ? ticket.date.toISOString() : new Date().toISOString(),
    messages: ticket.messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp ? msg.timestamp.toISOString() : new Date().toISOString()
    }))
  }));
}

async function createTicket(data) {
  const ticket = new SupportTicket(data);
  return await ticket.save();
}

async function getTicketsByUser(user_id) {
  return await SupportTicket.find({ user_id });
}

async function getTicketById(id) {
  return await SupportTicket.findById(id);
}

async function addMessage(ticketId, message) {
  const ticket = await SupportTicket.findById(ticketId);
  if (!ticket) throw new Error('Ticket not found');
  ticket.messages.push(message);
  return await ticket.save();
}

module.exports = {
  getAllTickets,
  createTicket,
  getTicketsByUser,
  getTicketById,
  addMessage
};
