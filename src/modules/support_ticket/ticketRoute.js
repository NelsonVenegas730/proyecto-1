const express = require('express');
const router = express.Router();
const supportTicketController = require('./ticketController');

router.post('/', supportTicketController.createTicket);
router.get('/user/:user_id', supportTicketController.getTicketsByUser);
router.get('/:id', supportTicketController.getTicketById);
router.post('/:id/message', supportTicketController.addMessage);

module.exports = router;
