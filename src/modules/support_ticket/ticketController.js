const supportTicketService = require('./ticketService');


async function getAllTickets(req, res) {
  try {
    const supportTickets = await supportTicketService.getAllTickets();

    res.render('ciudadano/sugerencias', {
      title: 'Quejas y sugerencias',
      style: '<link rel="stylesheet" href="/css/page-styles/sugerencias.css">',
      tickets: supportTickets,
      user: req.session.user || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los tickets');
  }
}

async function getAllTicketsAdmin(req, res) {
  try {
    const supportTickets = await supportTicketService.getAllTickets();

    res.render('administrador/admin-tiquetes', {
      title: 'Gestionar Tiquetes de Soporte',
      style: '<link rel="stylesheet" href="/css/page-styles/admin-tiquetes.css">',
      layout: 'layouts/layout-admin',
      tickets: supportTickets,
      user: req.session.user || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los tickets');
  }
}

async function createTicket(req, res) {
  try {
    const { title, description, urgency_level } = req.body;
    const user_id = req.session.user?._id;
    const sender_role = req.session.user?.role;

    if (!user_id) return res.status(401).send('No autorizado');

    if (!title || !description || !urgency_level) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const ticket = await supportTicketService.createTicket({
      title,
      description,
      urgency_level,
      user_id,
      sender_role
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addMessage(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const user = req.session.user;

    if (!user) return res.status(401).json({ error: 'No autorizado' });

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Mensaje vacío' });
    }

    const newMessage = {
      sender_role: user.role,
      message: message.trim(),
      timestamp: new Date(),
      user_id: user._id,
    };

    const updatedTicket = await supportTicketService.addMessage(id, newMessage);
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTicket(req, res) {
  const ticketId = req.params.id;
  const { title, description } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).json({ error: 'Título y descripción son obligatorios' });
    }

    const updatedTicket = await supportTicketService.updateTicket(ticketId, { title, description });
    res.json(updatedTicket);
  } catch (error) {
    if (error.message === 'Ticket no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Error al actualizar el tiquete' });
  }
}

async function deleteTicket(req, res) {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ error: 'Falta el ID del ticket' });
    }

    const result = await supportTicketService.deleteTicket(ticketId);
    res.json(result);
  } catch (err) {
    console.error('Error al eliminar ticket:', err.message);
    res.status(500).json({ error: 'No se pudo eliminar el ticket' });
  }
}

module.exports = {
  getAllTickets,
  getAllTicketsAdmin,
  createTicket,
  addMessage,
  updateTicket,
  deleteTicket
};
