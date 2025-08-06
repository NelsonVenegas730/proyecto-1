const Announcement = require('./announcementModel');
const mongoose = require('mongoose');

async function getAllAnnouncements() {
  return await Announcement.find();
}

async function createAnnouncement(data) {
  const announcement = new Announcement(data);
  return await announcement.save();
}

module.exports = {
  getAllAnnouncements,
  createAnnouncement
}