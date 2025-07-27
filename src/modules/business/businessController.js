const Business = require('./businessModel');
const businessService = require('./businessService');

async function getAllBusinesses(req, res) {
  try {
    const businesses = await Business.find().populate('user_id', 'nombre apellidos');
    const safeBusinesses = businesses.map(b => ({
      ...b._doc,
      name: b.name || 'Sin nombre',
      description: b.description || 'Sin descripción',
      address: b.address || 'Sin dirección',
      image: b.image || '/images/default.jpeg',
      user_id: b.user_id && b.user_id.nombre ? b.user_id : { nombre: 'Sin', apellidos: 'Dueño' },
      date: b.date || new Date()
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
    const data = req.body;
    if (!data.user_id || !data.date) {
      return res.status(400).json({ error: 'user_id and date are required' });
    }
    const business = await businessService.createBusiness(data);
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBusinessByUser(req, res) {
  try {
    const { user_id } = req.params;
    const businesses = await businessService.getBusinessByUser(user_id);
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBusinessById(req, res) {
  try {
    const business = await Business.findById(req.params.id).populate('user_id', 'nombre apellidos');
    if (!business) return res.status(404).send('Emprendimiento no encontrado');

    const safeBusiness = {
      ...business._doc,
      name: business.name || 'Sin nombre',
      description: business.description || 'Sin descripción',
      address: business.address || 'Sin dirección',
      image: business.image || '/images/default.jpeg',
      user_id: business.user_id && business.user_id.nombre
        ? business.user_id
        : { nombre: 'Sin', apellidos: 'Dueño' },
      date: business.date || new Date()
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
    const { id } = req.params;
    const data = req.body;
    const updated = await businessService.updateBusiness(id, data);
    if (!updated) return res.status(404).json({ error: 'Business not found' });
    res.json(updated);
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
