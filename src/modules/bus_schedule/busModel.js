const { Schema, model } = require('mongoose');

const busSchema = new Schema({
    destination: { type: String, required: true },
    arrival_time: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    wait_time_minutes: { type: Number, required: true },
});

module.exports = model('bus_schedule', busSchema);