const express = require('express');
const router = express.Router();
const Reservation = require('../../models/Reservation');
const Catway = require('../../models/Catway');

router.get('/', async (req, res) => {
  const resas = await Reservation.find().sort({ startDate: -1 }).limit(100);
  res.render('reservations/list', { title: 'Réservations', session: req.session, resas });
});

router.get('/new', async (req, res) => {
  const catways = await Catway.find().sort({ catwayNumber: 1 });
  res.render('reservations/new', { title: 'Nouvelle réservation', session: req.session, catways });
});

router.post('/', async (req, res) => {
  try {
    await Reservation.create({
      catwayNumber: req.body.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
    res.redirect('/reservations');
  } catch (e) {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render('reservations/new', { title: 'Nouvelle réservation', session: req.session, error: e.message, catways });
  }
});

router.get('/:id', async (req, res) => {
  const resa = await Reservation.findById(req.params.id);
  if (!resa) return res.redirect('/reservations');
  res.render('reservations/detail', { title: 'Réservation', session: req.session, resa });
});

router.post('/:id/update', async (req, res) => {
  await Reservation.findByIdAndUpdate(req.params.id, {
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  res.redirect(`/reservations/${req.params.id}`);
});

router.post('/:id/delete', async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.redirect('/reservations');
});

module.exports = router;
