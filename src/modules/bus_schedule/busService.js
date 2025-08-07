const bus_schedule = require('./busModel');

async function getAllBusSchedules() {
  return await bus_schedule.find();
}

module.exports = {
  getAllBusSchedules
}