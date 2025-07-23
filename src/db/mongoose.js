require('dotenv').config()
const mongoose = require('mongoose')

const DB_URI = process.env.MONGO_URI

function connectDB() {
  return mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
}

module.exports = connectDB