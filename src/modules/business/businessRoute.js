const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const businessController = require('./businessController');

router.post('/', upload.single('image'), businessController.createBusiness);
router.get('/user/:user_id', businessController.getBusinessByUser);
router.get('/:id', businessController.getBusinessById);
router.put('/update', upload.single('image'), businessController.updateBusiness);
router.get('/', businessController.getAllBusinesses);
router.put('/:id/status', businessController.updateBusinessStatus);

module.exports = router;