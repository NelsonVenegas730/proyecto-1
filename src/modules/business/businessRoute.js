const express = require('express');
const router = express.Router();
const businessController = require('./businessController');

router.post('/', businessController.createBusiness);
router.get('/user/:user_id', businessController.getBusinessByUser);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', businessController.updateBusiness);
router.get('/', businessController.getAllBusinesses)

module.exports = router;
