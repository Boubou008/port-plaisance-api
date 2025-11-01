/**
 * @file Routes API catways et sous-ressource reservations
 * @module routes/api/catways
 */
const express = require('express');
const router = express.Router();
const Catway = require('../../models/Catway');
const Reservation = require('../../models/Reservation');
const { catwayCreateSchema, catwayUpdateSchema, reservationCreateSchema } = require('../../validation/schemas');

// GET /catways
router.get('/', async (req, res) => {
  const items = await Catway.find().sort({ catwayNumber: 1 });
  res.json(items);
});

// GET /catways/:id
router.get('/:id', async (req, res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
  res.json(catway);
});

// POST /catways
router.post('/', async (req, res) => {
  const { error, value } = catwayCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const exists = await Catway.findOne({ catwayNumber: value.catwayNumber });
  if (exists) return res.status(409).json({ error: 'Numéro déjà existant' });
  const c = await Catway.create(value);
  res.status(201).json(c);
});

// PUT /catways/:id (seule la description d'état modifiable)
router.put('/:id', async (req, res) => {
  const { error, value } = catwayUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const updated = await Catway.findOneAndUpdate(
    { catwayNumber: req.params.id },
    { $set: { catwayState: value.catwayState } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Catway introuvable' });
  res.json(updated);
});

// DELETE /catways/:id
router.delete('/:id', async (req, res) => {
  const deleted = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  if (!deleted) return res.status(404).json({ error: 'Catway introuvable' });
  await Reservation.deleteMany({ catwayNumber: Number(req.params.id) });
  res.json({ message: 'Catway supprimé (réservations associées supprimées)' });
});

// ===== Sous-ressource reservations =====
// GET /catways/:id/reservations
router.get('/:id/reservations', async (req, res) => {
  const resas = await Reservation.find({ catwayNumber: Number(req.params.id) }).sort({ startDate: -1 });
  res.json(resas);
});

// GET /catways/:id/reservations/:idReservation
router.get('/:id/reservations/:idReservation', async (req, res) => {
  const resa = await Reservation.findOne({ _id: req.params.idReservation, catwayNumber: Number(req.params.id) });
  if (!resa) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(resa);
});

// POST /catways/:id/reservations
router.post('/:id/reservations', async (req, res) => {
  const { error, value } = reservationCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
  // simple overlap check for the same catway
  const overlap = await Reservation.findOne({
    catwayNumber: Number(req.params.id),
    $or: [
      { startDate: { $lte: new Date(value.endDate) }, endDate: { $gte: new Date(value.startDate) } }
    ]
  });
  if (overlap) return res.status(409).json({ error: 'Période déjà réservée pour ce catway' });
  const resa = await Reservation.create({ ...value, catwayNumber: Number(req.params.id) });
  res.status(201).json(resa);
});

// PUT /catways/:id/reservations (body doit contenir _id)
router.put('/:id/reservations', async (req, res) => {
  const { _id, ...data } = req.body;
  if (!_id) return res.status(400).json({ error: "Champ _id requis" });
  const { error, value } = reservationCreateSchema.validate(data);
  if (error) return res.status(400).json({ error: error.message });
  const updated = await Reservation.findOneAndUpdate(
    { _id, catwayNumber: Number(req.params.id) },
    { $set: value },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json(updated);
});

// DELETE /catways/:id/reservations/:idReservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
  const del = await Reservation.findOneAndDelete({ _id: req.params.idReservation, catwayNumber: Number(req.params.id) });
  if (!del) return res.status(404).json({ error: 'Réservation introuvable' });
  res.json({ message: 'Réservation supprimée' });
});

module.exports = router;
