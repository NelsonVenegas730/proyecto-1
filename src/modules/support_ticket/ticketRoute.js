const express = require('express');
const router = express.Router();
const supportTicketController = require('./ticketController');

router.post('/', supportTicketController.createTicket);
router.post('/:id/message', supportTicketController.addMessage);
router.put('/:id', supportTicketController.updateTicket);
router.delete('/:ticketId', supportTicketController.deleteTicket);
router.put('/:ticketId/status', supportTicketController.updateStatusController);

module.exports = router;