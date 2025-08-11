const Business = require('../../modules/business/businessModel');
const Announcement = require('../../modules/announcement/announcementModel');
const BusSchedule = require('../../modules/bus_schedule/busModel');

async function getAllContent() {
  const [businesses, announcements, busSchedules] = await Promise.all([
    Business.find().populate('user_id', 'name last_names'),
    Announcement.find().populate('user_id', 'name last_names'),
    BusSchedule.find()
  ]);

  return { businesses, announcements, busSchedules };
}

module.exports = { getAllContent };