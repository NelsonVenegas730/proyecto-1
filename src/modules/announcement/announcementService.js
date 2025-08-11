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

async function updateAnnouncementStatus(id, status) {
  return await Announcement.findByIdAndUpdate(id, { status }, { new: true });
}

async function updateAnnouncement(id, data) {
  return await Announcement.findByIdAndUpdate(id, data, { new: true });
}

async function deleteAnnouncement(id) {
  return await Announcement.findByIdAndDelete(id);
}

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  getLatestApprovedAnnouncement,
  updateAnnouncementStatus,
  updateAnnouncement,
  deleteAnnouncement
}