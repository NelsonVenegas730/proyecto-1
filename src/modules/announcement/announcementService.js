const Announcement = require('./announcementModel');

async function getAllAnnouncements() {
  return await Announcement.find();
}

async function createAnnouncement(data) {
  const announcement = new Announcement(data);
  return await announcement.save();
}

async function getLatestApprovedAnnouncement() {
  return await Announcement.findOne({ type: 'noticia', status: 'aprobado' })
    .sort({ date: -1 })
    .populate('user_id', 'name last_names');
}

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  getLatestApprovedAnnouncement
}