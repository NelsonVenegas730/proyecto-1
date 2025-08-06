const supportTicketService = require('./ticketService');

async function getAllTickets(req, res) {
  try {
    const tickets = await supportTicketService.getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTicket(req, res) {
  try {
    const data = req.body;
    if (!data.user_id || !data.date) {
      return res.status(400).json({ error: 'user_id and date are required' });
    }
    const ticket = await supportTicketService.createTicket(data);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTicketsByUser(req, res) {
  try {
    const { user_id } = req.params;
    const tickets = await supportTicketService.getTicketsByUser(user_id);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTicketById(req, res) {
  try {
    const { id } = req.params;
    const ticket = await supportTicketService.getTicketById(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addMessage(req, res) {
  try {
    const { id } = req.params;
    const message = req.body;
    if (!message.sender_role || !message.message || !message.timestamp) {
      return res.status(400).json({ error: 'Invalid message data' });
    }
    const updatedTicket = await supportTicketService.addMessage(id, message);
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllTickets,
  createTicket,
  getTicketsByUser,
  getTicketById,
  addMessage
};
