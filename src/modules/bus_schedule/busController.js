const busService = require('./busService');

async function getAllBusSchedules(req, res) {
  try {
    const busSchedules = await busService.getAllBusSchedules();

    console.log('Bus schedules retrieved:', busSchedules);

    function formatTo12Hour(time) {
        if (!time) return '';
        const [hour, minute] = time.split(':').map(Number)
        const suffix = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`
    }

    const busSchedulesFormatted = busSchedules.map(schedule => ({
      ...schedule,
      arrival_time: formatTo12Hour(schedule.arrival_time)
    }))

    res.render('ciudadano/horario-buses', {
      title: 'Horarios de Buses',
      style: '<link rel="stylesheet" href="/css/page-styles/horario-buses.css">',
      busSchedulesFormatted,
      userId: req.session.user?._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los horarios de buses');
  }
}

async function addBusSchedule(req, res) {
  try {
    const scheduleData = req.body;

    scheduleData.price = Number(scheduleData.price);
    scheduleData.wait_time_minutes = Number(scheduleData.wait_time_minutes);

    const newSchedule = await busService.createBusSchedule(scheduleData);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear horario' });
  }
}

async function deleteBusSchedule(req, res) {
  try {
    const { id } = req.params;
    const deleted = await busService.deleteBusScheduleById(id);
    if (!deleted) return res.status(404).json({ message: 'Horario no encontrado' });
    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando horario', error });
  }
}

async function updateBusSchedule(req, res) {
  try {
    const { id } = req.params;
    const { destination, arrival_time, address, price, wait_time_minutes } = req.body;

    const updatedData = {
      destination,
      arrival_time,
      address,
      price: Number(price),
      wait_time_minutes: Number(wait_time_minutes),
    };

    const updatedSchedule = await busService.updateBusScheduleById(id, updatedData);

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario actualizado', schedule: updatedSchedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error actualizando el horario' });
  }
}

module.exports = {
  getAllBusSchedules,
  addBusSchedule,
  deleteBusSchedule,
  updateBusSchedule
};