const Announcement = require('./announcementModel');
const announcementService = require('./announcementService');

async function getAllAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find().populate('user_id', 'name last_names, avatar');
    const safeAnnouncements = announcements.map(a => ({
      ...a._doc,
      title: a.title || 'Sin título',
      description: a.description || 'Sin descripción',
      image: (a.image && typeof a.image === 'string' && a.image.trim() !== '') ? '/uploads/' + a.image : '/images/default.jpeg',
      date: a.date ? a.date.toISOString() : new Date().toISOString(),
      type: a.type || 'sin tipo'
    }));
    res.render('ciudadano/noticias-anuncios-eventos', {
      title: 'Noticias, Anuncios y Eventos',
      style: '<link rel="stylesheet" href="/css/page-styles/noticias-anuncios-eventos.css">',
      anuncios: safeAnnouncements,
      userId: req.session.user?._id // o donde sea que lo tenés guardado
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los anuncios');
  }
}

async function createAnnouncement(req, res) {
  try {
    const { type, title, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const user = req.session.user;

    if (!user?._id) return res.status(401).send('No autorizado');

    if (!type || !title || !description) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const data = {
      type,
      title,
      description,
      image,
      user_id: user._id,
      date: new Date(),
      status: user.role === 'administrador' ? 'aprobado' : 'pendiente'
    };

    const announcement = await announcementService.createAnnouncement(data);

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el anuncio' });
  }
}

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ error: 'Status es requerido' });

  try {
    const updated = await announcementService.updateAnnouncementStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Anuncio no encontrado' });
    res.json({ message: 'Status actualizado', announcement: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar status' });
  }
}

async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      data.image = req.file.filename;
    }

    if (!data.title || !data.description) {
      return res.status(400).json({ error: 'Título y descripción son obligatorios' });
    }

    console.log('Update data:', data);

    const updated = await announcementService.updateAnnouncement(id, data);
    if (!updated) return res.status(404).json({ error: 'Anuncio no encontrado' });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar anuncio' });
  }
}

async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    await announcementService.deleteAnnouncement(id);
    res.json({ message: 'Anuncio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar anuncio' });
  }
}

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  updateStatus,
  updateAnnouncement,
  deleteAnnouncement
};