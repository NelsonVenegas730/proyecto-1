const Business = require('./businessModel');

async function getAllBusinesses() {
  return await Business.find()
}

async function createBusiness(data) {
  const business = new Business(data);
  return await business.save();
}

async function getBusinessByUser(user_id) {
  return await Business.find({ user_id });
}

async function getBusinessById(id) {
  return await Business.findById(id);
}

async function updateBusiness(id, data) {
  return await Business.findByIdAndUpdate(id, data, { new: true });
}

module.exports = {
  getAllBusinesses,
  createBusiness,
  getBusinessByUser,
  getBusinessById,
  updateBusiness
};
