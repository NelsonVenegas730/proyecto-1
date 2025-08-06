const Business = require('./businessModel');
const businessService = require('./businessService');

async function getAllBusinesses(req, res) {
  try {
    const businesses = await Business.find().populate('user_id', 'name last_names');
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
    res.render('ciudadano/emprendimientos', {
      title: 'Emprendimientos',
      style: '<link rel="stylesheet" href="/css/page-styles/emprendimientos.css">',
      emprendimientos: safeBusinesses
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los emprendimientos');
  }
}

async function createBusiness(req, res) {
  try {
    const { name, description, address } = req.body;
    const image = req.file ? req.file.filename : null;
    const user_id = req.session.user?._id;

    if (!user_id) return res.status(401).send('No autorizado');

    if (!name || !description || !address || !user_id) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const data = {
      name,
      description,
      address,
      image,
      user_id,
      date: new Date(),
      status: 'pendiente' // por si quieres setear status inicial
    };

    const business = await businessService.createBusiness(data);

    res.status(201).json({ success: true, business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar emprendimiento' });
  }
}

async function getBusinessByUser(req, res) {
  try {
    const { id: user_id } = req.params;

    const emprendimiento = await businessService.getSingleBusinessByUser(user_id);

    if (!emprendimiento) {
      return res.status(404).render('404', { mensaje: 'Emprendimiento no encontrado' });
    }

    res.render('emprendedor/mi-emprendimiento', {
      emprendimiento,
      user: req.session.user,
      title: 'Mi emprendimiento',
      style: '<link rel="stylesheet" href="/css/page-styles/emprendimiento.css">',
      layout: 'layouts/layout-default'
    });
  } catch (err) {
    console.error(err);
    res.status(404).render('error/404-not-found', { title: 'Error', mensaje: 'No se pudo obtener el emprendimiento' });
  }
}

async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.id).populate('user_id', 'name last_names');
    if (!business) return res.status(404).send('Emprendimiento no encontrado');

    const safeBusiness = {
      ...business._doc,
      name: business.name || 'Sin nombre',
      description: business.description || 'Sin descripción',
      address: business.address || 'Sin dirección',
      image: business.image || '/images/default.jpeg',
      user_id: business.user_id && business.user_id.name
        ? business.user_id
        : { name: 'Sin', last_names: 'Dueño' },
      date: business.date || new Date(),
      status: business.status || 'sin status'
    };

    res.render('ciudadano/emprendimiento-id', {
      title: safeBusiness.name || 'Emprendimiento',
      style: '<link rel="stylesheet" href="/css/page-styles/emprendimiento.css">',
      emprendimiento: safeBusiness
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el emprendimiento');
  }
}

async function updateBusiness(req, res) {
  try {
    const user_id = req.session.user._id;
    const { name, description, address } = req.body;
    const updateData = {
      name,
      description,
      address,
    };

    if (req.file) {
      updateData.image = req.file.filename;  // Guardar el nombre, no el buffer
    }

    const updated = await businessService.updateBusinessByUser(user_id, updateData);
    if (!updated) return res.status(404).json({ error: 'Emprendimiento no encontrado' });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllBusinesses,
  createBusiness,
  getBusinessByUser,
  getBusinessById,
  updateBusiness
};
