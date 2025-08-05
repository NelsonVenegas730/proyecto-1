const Business = require('./businessModel');
const mongoose = require('mongoose');

async function getAllBusinesses() {
  return await Business.find()
}

async function createBusiness(data) {
  const business = new Business(data);
  return await business.save();
}

async function getSingleBusinessByUser(user_id) {
  return await Business.findOne({ user_id: new mongoose.Types.ObjectId(user_id) });
}

async function getBusinessByUser(user_id) {
  return await Business.find({ user_id });
}

async function getBusinessById(id) {
  return await Business.findById(id);
}

async function updateBusinessByUser(user_id, data) {
  return await Business.findOneAndUpdate({ user_id }, data, { new: true });
}

module.exports = {
  getAllBusinesses,
  createBusiness,
  getSingleBusinessByUser,
  getBusinessByUser,
  getBusinessById,
  updateBusinessByUser
};
