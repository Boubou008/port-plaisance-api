const express = require('express');
const router = express.Router();
const Catway = require('../../models/Catway');

router.get('/', async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render('catways/list', { title: 'Catways', session: req.session, catways });
});

router.get('/new', (req, res) => {
  res.render('catways/new', { title: 'Nouveau catway', session: req.session });
});

router.post('/', async (req, res) => {
  try {
    await Catway.create({ catwayNumber: req.body.catwayNumber, catwayType: req.body.catwayType, catwayState: req.body.catwayState });
    res.redirect('/catways');
  } catch (e) {
    res.render('catways/new', { title: 'Nouveau catway', session: req.session, error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) return res.redirect('/catways');
  res.render('catways/detail', { title: 'Catway', session: req.session, catway });
});

router.post('/:id/state', async (req, res) => {
  await Catway.findOneAndUpdate({ catwayNumber: req.params.id }, { $set: { catwayState: req.body.catwayState } });
  res.redirect(`/catways/${req.params.id}`);
});

router.post('/:id/delete', async (req, res) => {
  await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  res.redirect('/catways');
});

module.exports = router;
