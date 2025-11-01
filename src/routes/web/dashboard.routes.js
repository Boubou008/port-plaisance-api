const express = require('express');
const router = express.Router();
const Reservation = require('../../models/Reservation');

router.get('/', async (req, res) => {
  const today = new Date();
  const inProgress = await Reservation.find({ startDate: { $lte: today }, endDate: { $gte: today } }).sort({ startDate: 1 });
  res.render('dashboard', { title: 'Tableau de bord', session: req.session, inProgress, today });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
