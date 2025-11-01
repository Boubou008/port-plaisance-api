/**
 * @file Routes API utilisateurs
 * @module routes/api/users
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { userCreateSchema, userUpdateSchema } = require('../../validation/schemas');

// GET /users/
router.get('/', async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
});

// GET /users/:email
router.get('/:email', async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(user);
});

// POST /users/
router.post('/', async (req, res) => {
  const { error, value } = userCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });
  const user = new User({ username: value.username, email: value.email, passwordHash: '' });
  await user.setPassword(value.password);
  await user.save();
  res.status(201).json({ id: user._id, username: user.username, email: user.email });
});

// PUT /users/:email
router.put('/:email', async (req, res) => {
  const { error, value } = userUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { $set: value },
    { new: true }
  ).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(user);
});

// DELETE /users/:email
router.delete('/:email', async (req, res) => {
  const user = await User.findOneAndDelete({ email: req.params.email });
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json({ message: 'Utilisateur supprimé' });
});

module.exports = router;
