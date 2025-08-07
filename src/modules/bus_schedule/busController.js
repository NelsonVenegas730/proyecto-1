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

module.exports = {
  getAllBusSchedules
};