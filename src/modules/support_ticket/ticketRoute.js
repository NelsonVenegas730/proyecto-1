const express = require('express');
const router = express.Router();
const supportTicketController = require('./ticketController');

router.post('/', supportTicketController.createTicket);
router.post('/:id/message', supportTicketController.addMessage);
router.delete('/:ticketId', supportTicketController.deleteTicket);

module.exports = router;