// scripts/reimport-catways.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Catway = require('../src/models/Catway');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');

    // charge le fichier JSON
    const data = require(path.join(__dirname, '..', 'catways.json'));
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('catways.json est vide ou invalide');
    }
    console.log('catways.json contient', data.length, 'éléments');

    // nettoie puis insère
    const before = await Catway.countDocuments();
    await Catway.deleteMany({});
    const inserted = await Catway.insertMany(data, { ordered: false });
    const after = await Catway.countDocuments();

    console.log(`Avant: ${before}  |  Insérés: ${inserted.length}  |  Après: ${after}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
