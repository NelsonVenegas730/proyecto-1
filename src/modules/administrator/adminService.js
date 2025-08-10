const Business = require('../../modules/business/businessModel');
const Announcement = require('../../modules/announcement/announcementModel');
const BusSchedule = require('../../modules/bus_schedule/busModel');

async function getAllContent() {
  const [businesses, announcements, busSchedules] = await Promise.all([
    Business.find(),
    Announcement.find(),
    BusSchedule.find()
  ]);

  return { businesses, announcements, busSchedules };
}

module.exports = { getAllContent };