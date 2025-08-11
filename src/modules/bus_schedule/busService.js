const bus_schedule = require('./busModel');

async function getAllBusSchedules() {
  return await bus_schedule.find();
}

async function createBusSchedule(data) {
  const newSchedule = new bus_schedule(data);
  return await newSchedule.save();
}

async function deleteBusScheduleById(id) {
  return await bus_schedule.findByIdAndDelete(id);
}

async function updateBusScheduleById(id, data) {
  return await bus_schedule.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  getAllBusSchedules,
  createBusSchedule,
  deleteBusScheduleById,
  updateBusScheduleById
};
