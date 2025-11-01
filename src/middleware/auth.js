/**
 * @file Middlewares d'authentification (session)
 * @module middleware/auth
 */
/**
 * Vérifie si l'utilisateur est authentifié (session).
 * @function ensureAuth
 */
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/');
}

module.exports = { ensureAuth };
