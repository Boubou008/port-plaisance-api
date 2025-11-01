const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.render('users/list', { title: 'Utilisateurs', session: req.session, users });
});

router.get('/new', (req, res) => {
  res.render('users/new', { title: 'Nouvel utilisateur', session: req.session });
});

router.post('/', async (req, res) => {
  try {
    const user = new User({ username: req.body.username, email: req.body.email, passwordHash: '' });
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect('/users');
  } catch (e) {
    res.render('users/new', { title: 'Nouvel utilisateur', session: req.session, error: e.message });
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) return res.redirect('/users');
  res.render('users/detail', { title: 'Utilisateur', session: req.session, user });
});

router.post('/:id/update', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { username: req.body.username });
  res.redirect(`/users/${req.params.id}`);
});

router.post('/:id/delete', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
