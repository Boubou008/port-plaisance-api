const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Catway = require('../src/models/Catway');
const Reservation = require('../src/models/Reservation');

async function importData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🔗 Connecté à MongoDB');

  // --- Import Catways ---
  const catwaysData = JSON.parse(fs.readFileSync('./catways.json', 'utf8'));
  await Catway.deleteMany({});
  await Catway.insertMany(catwaysData);
  console.log(`✅ ${catwaysData.length} catways importés`);

  // --- Import Reservations (tolérant, dates normalisées, logs d’erreurs) ---
const path = require('path');
const Reservation = require('../src/models/Reservation');

const reservationsRaw = JSON.parse(fs.readFileSync('./reservations.json', 'utf8'));

const toDate = (v) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

const reservations = reservationsRaw.map(r => ({
  catwayNumber: Number(r.catwayNumber),
  clientName: r.clientName?.trim(),
  boatName: r.boatName?.trim(),
  startDate: toDate(r.startDate),
  endDate: toDate(r.endDate),
}));

// filtre basique des lignes clairement invalides (dates illisibles, n° manquant, etc.)
const invalid = reservations.filter(r =>
  !r.catwayNumber || !r.clientName || !r.boatName || !r.startDate || !r.endDate
);
if (invalid.length) {
  console.warn(`⚠️  ${invalid.length} réservations ont des champs manquants/invalides et seront ignorées (voir import-reservations-failures.json).`);
}

const validReservations = reservations.filter(r =>
  r.catwayNumber && r.clientName && r.boatName && r.startDate && r.endDate
);

const failures = [];
let upserts = 0;

// Stratégie UPERT (évite doublons) : on considère (catwayNumber + startDate + clientName + boatName) comme clé “quasi unique”
for (const r of validReservations) {
  try {
    await Reservation.updateOne(
      {
        catwayNumber: r.catwayNumber,
        startDate: r.startDate,
        clientName: r.clientName,
        boatName: r.boatName,
      },
      { $set: r },
      { upsert: true }
    );
    upserts++;
  } catch (e) {
    failures.push({ doc: r, error: e.message });
  }
}

// Écrit un rapport des échecs si besoin
if (invalid.length || failures.length) {
  const reportPath = path.join(process.cwd(), 'import-reservations-failures.json');
  fs.writeFileSync(reportPath, JSON.stringify({ invalid, failures }, null, 2), 'utf8');
  console.warn(`📝 Rapport écrit : ${reportPath}`);
}

const totalInDb = await Reservation.countDocuments();
console.log(`✅ Réservations upsertées: ${upserts} | ❌ Échecs: ${failures.length + invalid.length} | Total en base maintenant: ${totalInDb}`);


  await mongoose.disconnect();
  console.log('🏁 Import terminé et déconnexion MongoDB');
}

importData().catch(err => {
  console.error('❌ Erreur lors de l’import :', err);
  process.exit(1);
});
