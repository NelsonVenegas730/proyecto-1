const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const announcementController = require('./announcementController');

router.post('/', upload.single('image'), announcementController.createAnnouncement);
router.get('/', announcementController.getAllAnnouncements);
router.put('/:id', upload.single('image'), announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;