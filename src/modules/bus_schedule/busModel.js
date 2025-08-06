const { Schema, model } = require('mongoose');

const busSchema = new Schema({
    destination: { type: String, required: true },
    arrival_time: { type: Date, required: true },
    address: { type: String, required: true },
    price: { type: String, required: true },
    wait_time_minutes: { type: String, required: true },
});

module.exports = model('bus_schedule', busSchema);