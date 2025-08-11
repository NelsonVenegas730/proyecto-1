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

async function updateStatus(type, id, newStatus) {
  const validTypes = ['business', 'announcement']
  if (!validTypes.includes(type)) throw new Error('Tipo inválido')

  const Model = type === 'business' ? Business : Announcement

  const updated = await Model.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true }
  )

  if (!updated) throw new Error('No se encontró el registro')

  return updated
}


module.exports = { getAllContent, updateStatus };