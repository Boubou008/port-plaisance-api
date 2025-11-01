require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../src/config/db');
const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');

(async () => {
  await connectDB();
  const catwaysPath = path.join(__dirname, '..', 'data', 'catways.json');
  const reservationsPath = path.join(__dirname, '..', 'data', 'reservations.json');
  if (fs.existsSync(catwaysPath)) {
    const items = JSON.parse(fs.readFileSync(catwaysPath, 'utf-8'));
    await Catway.deleteMany({});
    await Catway.insertMany(items);
    console.log('Catways importés:', items.length);
  }
  if (fs.existsSync(reservationsPath)) {
    const items = JSON.parse(fs.readFileSync(reservationsPath, 'utf-8'));
    await Reservation.deleteMany({});
    await Reservation.insertMany(items.map(i => ({...i, startDate: new Date(i.startDate), endDate: new Date(i.endDate)})));
    console.log('Réservations importées:', items.length);
  }
  process.exit(0);
})();
