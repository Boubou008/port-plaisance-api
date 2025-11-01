const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const router = express.Router();

// Page d'accueil
router.get('/', (req, res) => {
  res.render('index', { title: 'Accueil', error: null });
});

// Login depuis le formulaire (pose la session côté navigateur)
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    console.log('[LOGIN] tentative', { email });

    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.warn('[LOGIN] user not found');
      return res.status(401).render('index', { title: 'Accueil', error: 'Identifiants incorrects' });
    }

    // Champ de mot de passe (hash ou clair selon seed)
    const stored = user.password ?? user.passwordHash ?? user.hash ?? null;
    if (!stored) {
      console.warn('[LOGIN] aucun champ de mot de passe trouvé sur l’utilisateur');
      return res.status(500).render('index', { title: 'Accueil', error: 'Utilisateur mal configuré' });
    }

    // Vérification tolérante (hash bcrypt ou clair)
    const isBcrypt = typeof stored === 'string' && stored.startsWith('$2');
    const valid = isBcrypt ? await bcrypt.compare(password, stored) : password === stored;

    if (!valid) {
      console.warn('[LOGIN] mauvais mot de passe');
      return res.status(401).render('index', { title: 'Accueil', error: 'Identifiants incorrects' });
    }

    // Nettoie l'objet utilisateur pour la session
    const { password: _p, passwordHash: _ph, hash: _h, ...safeUser } = user;

    // 🔒 Anti-fixation de session + on force l'écriture avant de rediriger
    req.session.regenerate(err => {
      if (err) {
        console.error('[LOGIN] regenerate error', err);
        return res.status(500).render('index', { title: 'Accueil', error: 'Erreur serveur lors de la connexion' });
      }
      req.session.user = safeUser;
      req.session.save(saveErr => {
        if (saveErr) {
          console.error('[LOGIN] save error', saveErr);
          return res.status(500).render('index', { title: 'Accueil', error: 'Erreur serveur lors de la connexion' });
        }
        console.log('[LOGIN] succès pour', email);
        return res.redirect('/dashboard');
      });
    });
  } catch (err) {
    console.error('[LOGIN] erreur serveur', err);
    return res.status(500).render('index', { title: 'Accueil', error: 'Erreur serveur lors de la connexion' });
  }
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
