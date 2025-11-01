/**
 * @file Routes d'authentification API
 * @module routes/api/auth
 */
const express = require('express');
const router = express.Router();
const User = require('../../models/User');

/**
 * POST /api/login
 * @summary Authentifie un utilisateur et crée une session
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Identifiants invalides' });
  const ok = await user.validatePassword(password);
  if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });
  req.session.user = { id: user._id, email: user.email, username: user.username };
  res.json({ message: 'Connecté', user: req.session.user });
});

/**
 * GET /api/logout
 * @summary Déconnecte la session courante
 */
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Déconnecté' });
  });
});

module.exports = router;
