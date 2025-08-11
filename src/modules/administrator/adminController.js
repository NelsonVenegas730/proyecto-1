const adminService = require('./adminService');

function formatTo12Hour(time) {
  if (!time) return 'Hora no disponible'
  const [hourStr, minStr] = time.split(':')
  if (!hourStr || !minStr) return 'Hora no disponible'
  const hour = parseInt(hourStr)
  const minute = parseInt(minStr)
  if (isNaN(hour) || isNaN(minute)) return 'Hora no disponible'
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`
}

async function getManagementContent(req, res) {
  try {
    const { businesses, announcements, busSchedules } = await adminService.getAllContent();

    const safeBusinesses = businesses.map(b => ({
      ...b._doc,
      name: b.name || 'Sin nombre',
      description: b.description || 'Sin descripción',
      address: b.address || 'Sin dirección',
      image: (b.image && typeof b.image === 'string' && b.image.trim() !== '') ? '/uploads/' + b.image : '/images/default.jpeg',
      user_id: b.user_id && b.user_id.name ? b.user_id : { name: 'Sin', last_names: 'Dueño' },
      date: b.date ? b.date.toISOString() : new Date().toISOString(),
      status: b.status || 'sin status'
    }));

    const safeAnnouncements = announcements.map(a => ({
      ...a._doc,
      title: a.title || 'Sin título',
      description: a.description || 'Sin descripción',
      image: (a.image && typeof a.image === 'string' && a.image.trim() !== '') ? '/uploads/' + a.image : '/images/default.jpeg',
      date: a.date ? a.date.toISOString() : new Date().toISOString(),
      type: a.type || 'sin tipo',
      user_id: a.user_id && a.user_id.name ? a.user_id : { name: 'Sin', last_names: 'Dueño', avatar: '/images/default-avatar.png' }
    }));

    const safeBusSchedules = busSchedules.map(b => ({
      ...b._doc,
      destination: b.destination || 'Destino desconocido',
      arrival_time: formatTo12Hour(b.arrival_time),
      address: b.address || 'Dirección no disponible',
      price: (typeof b.price === 'number') ? b.price : 0,
      wait_time_minutes: (typeof b.wait_time_minutes === 'number') ? b.wait_time_minutes : 0
    }));

    res.render('administrador/admin-gestion-contenido', {
      title: 'Gestión de Contenido',
      style: '<link rel="stylesheet" href="/css/page-styles/admin-gestion-contenido.css">',
      businesses: safeBusinesses,
      announcements: safeAnnouncements,
      busSchedules: safeBusSchedules
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el contenido de gestión');
  }
}

module.exports = { getManagementContent };
