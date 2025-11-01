/**
 * @file Connexion MongoDB
 * @module config/db
 */
const mongoose = require('mongoose');

/**
 * Connexion à MongoDB via Mongoose.
 * @function connectDB
 * @returns {Promise<void>}
 */
async function connectDB () {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/port_russell';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
}

module.exports = { connectDB };
