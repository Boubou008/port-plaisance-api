/**
 * @file Modèle Catway
 * @module models/Catway
 */
const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true, index: true },
  catwayType: { type: String, enum: ['long', 'short'], required: true },
  catwayState: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Catway', catwaySchema);
