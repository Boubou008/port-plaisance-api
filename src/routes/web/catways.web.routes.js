const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const Catway = require('../../models/Catway');

const router = express.Router();

// Helper: chemin absolu vers catways.json (à la racine du projet)
const CATWAYS_JSON_PATH = path.join(__dirname, '..', '..', '..', 'catways.json');

/**
 * GET /catways
 * - Affiche la liste depuis MongoDB
 * - + le contenu brut du fichier catways.json (rawCatways) pour l'affichage
 */
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 }).lean();

    let rawCatways = [];
    try {
      const raw = await fs.readFile(CATWAYS_JSON_PATH, 'utf-8');
      rawCatways = JSON.parse(raw);
    } catch (fileErr) {
      console.warn('[CATWAYS] Impossible de lire catways.json :', fileErr.message);
      // On laisse rawCatways = [] si le fichier est absent/illisible
    }

    res.render('catways/list', {
      title: 'Catways',
      catways,
      rawCatways,               // <-- dispo dans la vue
    });
  } catch (err) {
    console.error('[CATWAYS] list error', err);
    res.status(500).render('error', { title: 'Erreur', error: 'Impossible de charger les catways' });
  }
});

/**
 * (Optionnel) Affichage séparé du JSON brut si tu veux une page dédiée
 * GET /catways/raw-json
 */
router.get('/raw-json', async (req, res) => {
  try {
    const raw = await fs.readFile(CATWAYS_JSON_PATH, 'utf-8');
    const data = JSON.parse(raw);
    res.render('catways/raw', { title: 'Catways (fichier JSON)', data });
  } catch (err) {
    console.error('[CATWAYS] raw-json error', err);
    res.status(500).render('error', { title: 'Erreur', error: 'Impossible de lire catways.json' });
  }
});

router.get('/new', (req, res) => {
  res.render('catways/new', { title: 'Nouveau catway' });
});

router.post('/', async (req, res) => {
  try {
    await Catway.create({
      catwayNumber: req.body.catwayNumber,
      catwayType: req.body.catwayType,
      catwayState: req.body.catwayState
    });
    res.redirect('/catways');
  } catch (e) {
    res.render('catways/new', { title: 'Nouveau catway', error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id }).lean();
  if (!catway) return res.redirect('/catways');
  res.render('catways/detail', { title: 'Catway', catway });
});

router.post('/:id/state', async (req, res) => {
  await Catway.findOneAndUpdate(
    { catwayNumber: req.params.id },
    { $set: { catwayState: req.body.catwayState } }
  );
  res.redirect(`/catways/${req.params.id}`);
});

router.post('/:id/delete', async (req, res) => {
  await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  res.redirect('/catways');
});

module.exports = router;
